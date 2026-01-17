import { supabase } from '../../config/supabase'

export const fetchCategories = async (businessId?: string) => {
  let query = supabase
    .from('category')
    .select('*')
    .eq('is_active', true)
  
  if (businessId) {
    query = query.eq('business_id', businessId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export const fetchRootCategories = async (businessId?: string) => {
  let query = supabase
    .from('category')
    .select('*')
    .eq('is_active', true)
    .is('parent_id', null)
  
  if (businessId) {
    query = query.eq('business_id', businessId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export const fetchCategoryById = async (id: string) => {
  const { data, error } = await supabase
    .from('category')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()
  
  if (error) throw error
  return data
}

export const createCategory = async (data: { name: string; business_id: string; parent_id?: string }) => {
  const { data: created, error } = await supabase
    .from('category')
    .insert(data)
    .select()
    .single()
  
  if (error) throw error
  return created
}

export const updateCategory = async (id: string, updates: { name?: string; parent_id?: string }) => {
  const { data, error } = await supabase
    .from('category')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('category')
    .update({ is_active: false })
    .eq('id', id)
  
  if (error) throw error
  return true
}
