import { Request, Response, NextFunction } from 'express'
import { supabase } from '../../config/supabase'
import { fetchOrders, fetchOrderById, createOrder, updateOrder, updateOrderWithHistory, fetchOrderStatusHistory, insertStatusHistory } from './order.repo'
import { fetchProductById } from '../products/products.repo'
import { OrderItem, OrderStatus } from './order.types'
import { sendTextMessage } from '../whatsapp/whatsapp.service'
import { createSteadfastOrder } from '../courier/courier.service'

// Helper to derive current status from history (latest entry)
const deriveCurrentStatus = (history: any[]): OrderStatus | undefined => {
  if (!history || history.length === 0) return undefined
  return history[0]?.status
}

export const getOrdersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await fetchOrders()

    // Include status history for each order and derive current status
    const ordersWithHistory = await Promise.all(
      orders.map(async (order: any) => {
        const history = await fetchOrderStatusHistory(order.id)
        return { ...order, history, status: deriveCurrentStatus(history) }
      })
    )

    res.json(ordersWithHistory)
  } catch (e) {
    next(e)
  }
}

export const getBusinessOrdersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: businessId } = req.params
    const orders = await fetchOrders({ business_id: businessId as string })

    // Include status history for each order and derive current status
    const ordersWithHistory = await Promise.all(
      orders.map(async (order: any) => {
        const history = await fetchOrderStatusHistory(order.id)
        return { ...order, history, status: deriveCurrentStatus(history) }
      })
    )

    res.json(ordersWithHistory)
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

    // Always include status history and derive current status
    const history = await fetchOrderStatusHistory(id as string)
    res.json({ ...order, order_items: orderItemsWithProducts, history, status: deriveCurrentStatus(history) })
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
    let deliveryCharge = 0
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
      deliveryCharge = Math.max(deliveryCharge, Number(product.delivery_charge) || 0)

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
      shipping_address,
      delivery_charge: deliveryCharge
    }, orderItems)

    // 4. Record initial status in history
    await insertStatusHistory(order.id, 'pending')

    // 5. Send WhatsApp notification
    //if (phone) {
      // Clean phone number: remove +, spaces, dashes, etc.
      const w_b_n = '8801722454490'
      const message = `New order received! 🛒\n\nTracing link: https://indoorshopping.web.app/orders/${order.id} \n\nUser Phone: ${phone}`

      // Fire-and-forget: don't await to avoid blocking the response
      await sendTextMessage(w_b_n, message)
        .catch(error => console.error('Failed to send WhatsApp notification:', error))
    //}

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

// Normalize phone to the 11-digit local format Steadfast expects (01XXXXXXXXX)
const normalizePhone = (phone?: string | null): string | undefined => {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 13 && digits.startsWith('880')) return `0${digits.slice(3)}`
  return digits
}

export const requestPickupHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const order = await fetchOrderById(id as string)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.cod_reference) {
      return res.status(409).json({
        message: 'Pickup already requested for this order',
        cod_reference: order.cod_reference
      })
    }

    const address = order.shipping_address || {}

    // Recipient phone: body override > shipping address > auth user phone
    let recipientPhone = req.body.recipient_phone || address.phone
    if (!recipientPhone && order.user_id) {
      const { data } = await supabase.auth.admin.getUserById(order.user_id)
      recipientPhone = data?.user?.phone || data?.user?.user_metadata?.phone
    }

    const recipientAddress =
      req.body.recipient_address ||
      (typeof address === 'string'
        ? address
        : [address.street, address.city, address.state, address.zip, address.country]
            .filter(Boolean)
            .join(', '))

    const codAmount =
      req.body.cod_amount ?? Number(order.total_amount) + (Number(order.delivery_charge) || 0)

    const result = await createSteadfastOrder({
      invoice: order.id,
      recipient_name: req.body.recipient_name || address.name || 'Customer',
      recipient_phone: normalizePhone(recipientPhone) || '',
      recipient_address: recipientAddress,
      cod_amount: codAmount,
      note: req.body.note,
      item_description: req.body.item_description,
      delivery_type: req.body.delivery_type
    })

    if (!result.success) {
      if (result.error?.includes('Network error')) {
        return res.status(503).json({
          error: 'Service unavailable: Unable to connect to Steadfast service'
        })
      }
      return res.status(400).json({ error: result.error })
    }

    const updatedOrder = await updateOrder(id as string, {
      cod_reference: String(result.consignment!.consignment_id)
    })

    res.status(200).json({
      success: true,
      consignment: result.consignment,
      order: updatedOrder
    })
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
