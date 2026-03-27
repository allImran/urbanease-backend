import { supabase } from '../../config/supabase'
import { TempUser, CreateTempUserDTO, UpdateTempUserDTO, SearchTempUsersQuery, TempUserListResponse } from './temp-user.types'

export const createTempUser = async (userData: CreateTempUserDTO): Promise<TempUser> => {
  const { data, error } = await supabase
    .from('temp_users')
    .insert(userData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const fetchTempUserById = async (id: string): Promise<TempUser | null> => {
  const { data, error } = await supabase
    .from('temp_users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

export const fetchTempUserByPhone = async (phone: string): Promise<TempUser | null> => {
  const { data, error } = await supabase
    .from('temp_users')
    .select('*')
    .eq('phone', phone)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

export const updateTempUser = async (id: string, updates: UpdateTempUserDTO): Promise<TempUser> => {
  const { data, error } = await supabase
    .from('temp_users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const searchTempUsers = async (query: SearchTempUsersQuery): Promise<TempUserListResponse> => {
  const { search, page = 1, limit = 20 } = query
  const offset = (page - 1) * limit

  let dbQuery = supabase
    .from('temp_users')
    .select('*', { count: 'exact' })

  if (search) {
    // Search by name (partial match) or phone (exact match)
    dbQuery = dbQuery.or(`name.ilike.%${search}%,phone.eq.${search}`)
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
