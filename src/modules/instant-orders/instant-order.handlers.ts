import { Request, Response, NextFunction } from 'express'
import {
  resolveOrCreateTempUser,
  createInstantOrder,
  fetchInstantOrderById,
  updateInstantOrder,
  listInstantOrders,
  calculateOrderTotal
} from './instant-order.repo'
import { CreateInstantOrderDTO, UpdateInstantOrderDTO, ListInstantOrdersQuery } from './instant-order.types'

export const createInstantOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderData: CreateInstantOrderDTO = req.body
    const userBusinessId = (req as any).user?.business_id

    // 1. Business isolation check
    // if (orderData.business_id !== userBusinessId) {
    //   return res.status(403).json({
    //     error: 'Forbidden',
    //     message: 'You can only create orders for your own business'
    //   })
    // }

    // 2. Validate user_id vs (customer_info.name + customer_info.phone) logic
    if (!orderData.user_id && (!orderData.customer_info?.name || !orderData.customer_info?.phone)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Either user_id or customer_info (name + phone) must be provided'
      })
    }

    // 3. Resolve or create temp user (global, no business check)
    const { temp_user_id, customer_info } = await resolveOrCreateTempUser({
      user_id: orderData.user_id,
      name: orderData.customer_info?.name,
      phone: orderData.customer_info?.phone,
      address: orderData.customer_info?.address
    })

    // 4. Validate order_items structure
    if (!Array.isArray(orderData.order_items) || orderData.order_items.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Order items must be a non-empty array'
      })
    }

    for (const item of orderData.order_items) {
      if (!item.title || typeof item.price !== 'number' || typeof item.quantity !== 'number' || !item.unit) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Each order item must have title, price, quantity, and unit'
        })
      }
    }

    // 5. Create order with customer snapshot
    const order = await createInstantOrder(orderData, temp_user_id, customer_info)

    // 6. Add calculated total to response
    const orderWithTotal = {
      ...order,
      total: calculateOrderTotal(order)
    }

    res.status(201).json(orderWithTotal)
  } catch (e) {
    next(e)
  }
}

export const updateInstantOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updates: UpdateInstantOrderDTO = req.body
    const userBusinessId = (req as any).user?.business_id

    // 1. Check if order exists and belongs to user's business
    const existingOrder = await fetchInstantOrderById(id as string)
    if (!existingOrder) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Instant order not found'
      })
    }

    // if (existingOrder.business_id !== userBusinessId) {
    //   return res.status(403).json({
    //     error: 'Forbidden',
    //     message: 'You can only update orders from your own business'
    //   })
    // }

    // 2. Update order (preserve customer_info unless explicitly provided)
    const updatedOrder = await updateInstantOrder(id as string, updates)

    // 3. Add calculated total to response
    const orderWithTotal = {
      ...updatedOrder,
      total: calculateOrderTotal(updatedOrder)
    }

    res.json(orderWithTotal)
  } catch (e) {
    next(e)
  }
}

export const listInstantOrdersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userBusinessId = (req as any).user?.business_id
    const userRole = (req as any).user?.app_metadata?.role

    const query: ListInstantOrdersQuery = {
      business_id: req.query.business_id as string || userBusinessId,
      user_id: req.query.user_id as string,
      status: req.query.status as any,
      search: req.query.search as string,
      from: req.query.from as string,
      to: req.query.to as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    }

    // Business isolation check (unless superadmin)
    // if (userRole !== 'superadmin' && query.business_id !== userBusinessId) {
    //   return res.status(403).json({
    //     error: 'Forbidden',
    //     message: 'You can only view orders from your own business'
    //   })
    // }

    const result = await listInstantOrders(query)

    // Add calculated totals to each order
    const ordersWithTotals = result.data.map(order => ({
      ...order,
      total: calculateOrderTotal(order)
    }))

    res.json({
      ...result,
      data: ordersWithTotals
    })
  } catch (e) {
    next(e)
  }
}

export const getInstantOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userBusinessId = (req as any).user?.business_id

    const order = await fetchInstantOrderById(id as string)
    if (!order) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Instant order not found'
      })
    }

    // Business isolation check
    // if (order.business_id !== userBusinessId) {
    //   return res.status(403).json({
    //     error: 'Forbidden',
    //     message: 'You can only view orders from your own business'
    //   })
    // }

    // Add calculated total
    const orderWithTotal = {
      ...order,
      total: calculateOrderTotal(order)
    }

    res.json(orderWithTotal)
  } catch (e) {
    next(e)
  }
}
