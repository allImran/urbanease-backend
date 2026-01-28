import { supabase } from '../../config/supabase'

// Product Interfaces
export interface Product {
  id: string
  name: string
  slug: string
  image_urls: string[]
  sections: any[]
  category_id?: string
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  price: number
  attributes: any
  created_at: string
  updated_at: string
}

// --- Products ---

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:category(*)')
  
  if (error) throw error
  return data
}

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:category(*), variants:product_variants(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const fetchProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:category(*, business:business(*)), variants:product_variants(*)')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export const createProduct = async (productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

// --- Variants ---

export const fetchVariantsByProductId = async (productId: string) => {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
  
  if (error) throw error
  return data
}

export const createVariant = async (variantData: Partial<ProductVariant>) => {
  const { data, error } = await supabase
    .from('product_variants')
    .insert(variantData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateVariant = async (id: string, updates: Partial<ProductVariant>) => {
  const { data, error } = await supabase
    .from('product_variants')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteVariant = async (id: string) => {
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}
