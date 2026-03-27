import { Request, Response, NextFunction } from 'express'
import {
  createSteadfastOrder,
  createBulkSteadfastOrders,
  getDeliveryStatusByCid,
  getDeliveryStatusByInvoice,
  getDeliveryStatusByTrackingCode
} from './courier.service'
import type {
  CreateOrderRequest,
  BulkOrderRequest,
  CreateOrderResponse,
  BulkOrderResponse,
  DeliveryStatusResponse
} from './courier.types'

export const createOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderData = req.body as CreateOrderRequest

    // Call service layer
    const result: CreateOrderResponse = await createSteadfastOrder(orderData)

    // Handle different response scenarios
    if (result.success) {
      return res.status(200).json({
        success: true,
        consignment: result.consignment
      })
    }

    // Check if it's a network error
    if (result.error?.includes('Network error')) {
      return res.status(503).json({
        error: 'Service unavailable: Unable to connect to Steadfast service'
      })
    }

    // Validation or API error
    return res.status(400).json({
      error: result.error
    })
  } catch (error) {
    console.error('Unexpected error in createOrderHandler:', error)
    next(error)
  }
}

export const bulkOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body as BulkOrderRequest

    // Call service layer
    const result: BulkOrderResponse = await createBulkSteadfastOrders(data)

    // Handle different response scenarios
    if (result.success) {
      return res.status(200).json({
        success: true,
        results: result.results
      })
    }

    // Check if it's a network error
    if (result.error?.includes('Network error')) {
      return res.status(503).json({
        error: 'Service unavailable: Unable to connect to Steadfast service'
      })
    }

    // Validation or API error
    return res.status(400).json({
      error: result.error
    })
  } catch (error) {
    console.error('Unexpected error in bulkOrderHandler:', error)
    next(error)
  }
}

export const getDeliveryStatusByCidHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cid } = req.params
    const cidValue = Array.isArray(cid) ? cid[0] : cid

    // Call service layer
    const result: DeliveryStatusResponse = await getDeliveryStatusByCid(cidValue)

    // Handle different response scenarios
    if (result.success) {
      return res.status(200).json({
        success: true,
        delivery_status: result.delivery_status
      })
    }

    // Check if it's a network error
    if (result.error?.includes('Network error')) {
      return res.status(503).json({
        error: 'Service unavailable: Unable to connect to Steadfast service'
      })
    }

    // Validation or API error
    return res.status(400).json({
      error: result.error
    })
  } catch (error) {
    console.error('Unexpected error in getDeliveryStatusByCidHandler:', error)
    next(error)
  }
}

export const getDeliveryStatusByInvoiceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { invoice } = req.params
    const invoiceValue = Array.isArray(invoice) ? invoice[0] : invoice

    // Call service layer
    const result: DeliveryStatusResponse = await getDeliveryStatusByInvoice(invoiceValue)

    // Handle different response scenarios
    if (result.success) {
      return res.status(200).json({
        success: true,
        delivery_status: result.delivery_status
      })
    }

    // Check if it's a network error
    if (result.error?.includes('Network error')) {
      return res.status(503).json({
        error: 'Service unavailable: Unable to connect to Steadfast service'
      })
    }

    // Validation or API error
    return res.status(400).json({
      error: result.error
    })
  } catch (error) {
    console.error('Unexpected error in getDeliveryStatusByInvoiceHandler:', error)
    next(error)
  }
}

export const getDeliveryStatusByTrackingCodeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trackingCode } = req.params
    const trackingCodeValue = Array.isArray(trackingCode) ? trackingCode[0] : trackingCode

    // Call service layer
    const result: DeliveryStatusResponse = await getDeliveryStatusByTrackingCode(trackingCodeValue)

    // Handle different response scenarios
    if (result.success) {
      return res.status(200).json({
        success: true,
        delivery_status: result.delivery_status
      })
    }

    // Check if it's a network error
    if (result.error?.includes('Network error')) {
      return res.status(503).json({
        error: 'Service unavailable: Unable to connect to Steadfast service'
      })
    }

    // Validation or API error
    return res.status(400).json({
      error: result.error
    })
  } catch (error) {
    console.error('Unexpected error in getDeliveryStatusByTrackingCodeHandler:', error)
    next(error)
  }
}
