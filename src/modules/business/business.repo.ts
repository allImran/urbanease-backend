import { supabase } from '../../config/supabase'
import type { Business, CreateBusinessDTO, UpdateBusinessDTO } from './business.types'

export const fetchBusinesses = async (): Promise<Business[]> => {
  //select only active business
  const { data, error } = await supabase
    .from('business')
    .select('*')
    .eq('is_active', true)
  
  if (error) throw error
  return data
}

export const fetchBusinessById = async (id: string): Promise<Business> => {
  const { data, error } = await supabase
    .from('business')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()
  
  if (error) throw error
  return data
}

export const createBusiness = async (data: CreateBusinessDTO): Promise<Business> => {
  const { data: created, error } = await supabase
    .from('business')
    .insert(data)
    .select()
    .single()
  
  if (error) throw error
  return created
}

export const updateBusiness = async (id: string, updates: UpdateBusinessDTO): Promise<Business[]> => {
  const { data, error } = await supabase
  .from('business')
  .update(updates)
  .eq('id', id)
  .select()
  // .single()
  // console.log(data, error)
  
  if (error) throw error
  return data
}

export const deleteBusiness = async (id: string) => {
  const { error } = await supabase
    .from('business')
    .update({ is_active: false })
    .eq('id', id)
  
  if (error) throw error
  return true
}
