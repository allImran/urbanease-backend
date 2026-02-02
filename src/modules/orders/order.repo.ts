import { supabase } from '../../config/supabase'
import { Order, OrderItem, UpdateOrderDTO } from './order.types'

export const fetchOrders = async (filters: { user_id?: string; business_id?: string } = {}) => {
  let query = supabase.from('orders').select('*, order_items(*)')

  if (filters.user_id) query = query.eq('user_id', filters.user_id)
  if (filters.business_id) query = query.eq('business_id', filters.business_id)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const fetchOrderById = async (id: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createOrder = async (orderData: Partial<Order>, items: Partial<OrderItem>[]) => {
  // 1. Insert Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (orderError) throw orderError

  // 2. Insert Items
  const itemsWithOrderId = items.map(item => ({ ...item, order_id: order.id }))
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsWithOrderId)
    .select()

  if (itemsError) {
    // Note: Rollback logic would be ideal here if supported via RPC/stored procedure
    throw itemsError
  }

  return { ...order, order_items: orderItems }
}

export const updateOrder = async (id: string, updates: UpdateOrderDTO) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
