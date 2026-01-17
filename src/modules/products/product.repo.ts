import { supabase } from '../../config/supabase'

export const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    throw error
  }
  return data
}
