import { Request, Response, NextFunction } from 'express'
import { supabase } from '../../config/supabase'
import { fetchOrders, fetchOrderById, createOrder, updateOrder, updateOrderWithHistory, fetchOrderStatusHistory, insertStatusHistory } from './order.repo'
import { fetchProductById } from '../products/products.repo'
import { OrderItem } from './order.types'

export const getOrdersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await fetchOrders()
    res.json(orders)
  } catch (e) {
    next(e)
  }
}

export const getBusinessOrdersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: businessId } = req.params
    const orders = await fetchOrders({ business_id: businessId as string })
    res.json(orders)
  } catch (e) {
    next(e)
  }
}

export const getOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const order = await fetchOrderById(id as string)

    // Fetch full product details for each order item
    const orderItemsWithProducts = await Promise.all(
      (order.order_items || []).map(async (item: any) => {
        const product = await fetchProductById(item.product_id)
        return {
          ...item,
          product
        }
      })
    )

    // Always include status history
    const history = await fetchOrderStatusHistory(id as string)
    res.json({ ...order, order_items: orderItemsWithProducts, history })
  } catch (e) {
    next(e)
  }
}

export const createOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { business_id, shipping_address, phone, items } = req.body
    let userId = (req as any).user?.id

    // 1. User Resolution
    if (!userId && phone) {
      // Search for existing user by phone
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
      if (listError) throw listError

      const existingUser = users.find(u => u.phone === phone)

      if (existingUser) {
        userId = existingUser.id
      } else {
        // Create new user (customer)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          phone,
          password: Math.random().toString(36).slice(-10), // Generate a random temp password
          app_metadata: { role: 'customer' },
          user_metadata: { phone },
          email_confirm: true
        })
        if (createError) throw createError
        userId = newUser.user.id
      }
    }

    // 2. Price Calculation & Snapshot
    let totalAmount = 0
    const orderItems: Partial<OrderItem>[] = []

    for (const item of items) {
      const product = await fetchProductById(item.product_id)
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` })
      }

      const variant = product.variants?.find((v: any) => v.id === item.variant_id)
      if (!variant) {
        return res.status(400).json({ message: `Variant ${item.variant_id} not found for product ${item.product_id}` })
      }

      const price = Number(variant.price)
      totalAmount += price * item.quantity

      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_purchase: price,
        snapshot_name: `${product.name} (${variant.sku || 'Default'})`
      })
    }

    // 3. Create Order
    const order = await createOrder({
      user_id: userId,
      total_amount: totalAmount,
      business_id,
      shipping_address
    }, orderItems)

    // 4. Record initial status in history
    await insertStatusHistory(order.id, 'pending')

    res.status(201).json(order)
  } catch (e) {
    next(e)
  }
}

export const updateOrderStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status, comment } = req.body
    const order = await updateOrderWithHistory(id as string, status, comment)
    res.json(order)
  } catch (e) {
    next(e)
  }
}

export const updateOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const order = await updateOrder(id as string, req.body)
    res.json(order)
  } catch (e) {
    next(e)
  }
}

export const getOrderStatusHistoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // First check if user has access to the order
    const order = await fetchOrderById(id as string)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // RBAC check: Only Admin/Staff or the owner can view history
    const userRole = (req as any).user?.app_metadata?.role
    const userId = (req as any).user?.id

    if (userRole === 'customer' && order.user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this order' })
    }

    const history = await fetchOrderStatusHistory(id as string)
    res.json(history)
  } catch (e) {
    next(e)
  }
}
