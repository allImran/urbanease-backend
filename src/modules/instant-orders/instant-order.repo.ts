import { supabase } from '../../config/supabase'
import {
  InstantOrder,
  CreateInstantOrderDTO,
  UpdateInstantOrderDTO,
  ListInstantOrdersQuery,
  InstantOrderListResponse,
  CustomerInfo
} from './instant-order.types'
import { fetchTempUserById, fetchTempUserByPhone, createTempUser } from '../temp-users/temp-user.repo'

export const resolveOrCreateTempUser = async (params: {
  user_id?: string
  name?: string
  phone?: string
  address?: string
}): Promise<{ temp_user_id: string; customer_info: CustomerInfo }> => {
  // Path 1: user_id provided - fetch existing (global, no business check)
  if (params.user_id) {
    const user = await fetchTempUserById(params.user_id)
    if (!user) {
      throw new Error('Temp user not found')
    }
    return {
      temp_user_id: user.id,
      customer_info: {
        name: user.name,
        phone: user.phone,
        address: user.address || ''
      }
    }
  }

  // Path 2: No user_id - create new temp user (global)
  if (!params.name || !params.phone) {
    throw new Error('name and phone required when user_id not provided')
  }

  // Check if user with this phone already exists
  const existingUser = await fetchTempUserByPhone(params.phone)
  const newUser = existingUser || await createTempUser({
    name: params.name,
    phone: params.phone,
    address: params.address || ''
  })

  return {
    temp_user_id: newUser.id,
    customer_info: {
      name: newUser.name,
      phone: newUser.phone,
      address: newUser.address || ''
    }
  }
}

export const createInstantOrder = async (
  orderData: CreateInstantOrderDTO,
  tempUserId: string,
  customerInfo: CustomerInfo
): Promise<InstantOrder> => {
  const { business_id, delivery_charge = 0, cod_reference, order_items } = orderData

  const { data, error } = await supabase
    .from('instant_orders')
    .insert({
      business_id,
      temp_user_id: tempUserId,
      customer_info: customerInfo,
      delivery_charge,
      cod_reference,
      order_items,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const fetchInstantOrderById = async (id: string): Promise<InstantOrder | null> => {
  const { data, error } = await supabase
    .from('instant_orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export const updateInstantOrder = async (
  id: string,
  updates: UpdateInstantOrderDTO
): Promise<InstantOrder> => {
  const { data, error } = await supabase
    .from('instant_orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const listInstantOrders = async (
  query: ListInstantOrdersQuery
): Promise<InstantOrderListResponse> => {
  const {
    business_id,
    user_id,
    status,
    search,
    from,
    to,
    page = 1,
    limit = 20
  } = query

  const offset = (page - 1) * limit

  let dbQuery = supabase
    .from('instant_orders')
    .select('*', { count: 'exact' })

  // Business isolation (required)
  dbQuery = dbQuery.eq('business_id', business_id)

  // Optional filters
  if (user_id) {
    dbQuery = dbQuery.eq('temp_user_id', user_id)
  }

  if (status) {
    dbQuery = dbQuery.eq('status', status)
  }

  if (search) {
    // JSONB search in customer_info
    dbQuery = dbQuery.or(`customer_info->>name.ilike.%${search}%,customer_info->>phone.ilike.%${search}%`)
  }

  if (from) {
    dbQuery = dbQuery.gte('created_at', from)
  }

  if (to) {
    dbQuery = dbQuery.lte('created_at', to)
  }

  const { data, error, count } = await dbQuery
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0
    }
  }
}

export const calculateOrderTotal = (order: InstantOrder): number => {
  const itemsTotal = order.order_items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  )
  return itemsTotal + (order.delivery_charge || 0)
}
