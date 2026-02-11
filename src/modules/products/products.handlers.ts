import { Request, Response, NextFunction } from 'express'
import {
  fetchProducts,
  fetchProductById,
  fetchProductBySlug,
  fetchProductsByBusinessId,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchVariantsByProductId,
  createVariant,
  updateVariant,
  deleteVariant
} from './products.repo'

// --- Product Handlers ---

export const getProductsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await fetchProducts()
    res.json(products)
  } catch (e) {
    next(e)
  }
}

export const getProductsByBusinessHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { businessId } = req.params
    const products = await fetchProductsByBusinessId(businessId as string)
    res.json(products)
  } catch (e) {
    next(e)
  }
}

export const getProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const product = await fetchProductById(id as string)

    res.json(product)
  } catch (e) {
    next(e)
  }
}

export const getProductBySlugHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const product = await fetchProductBySlug(slug as string)

    res.json(product)
  } catch (e) {
    next(e)
  }
}

export const createProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await createProduct(req.body)
    res.status(201).json(product)
  } catch (e) {
    next(e)
  }
}

export const updateProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const product = await updateProduct(id as string, req.body)

    res.json(product)
  } catch (e) {
    next(e)
  }
}

export const deleteProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await deleteProduct(id as string)

    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

// --- Variant Handlers ---

export const getVariantsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params // product_id
    const variants = await fetchVariantsByProductId(id as string)

    res.json(variants)
  } catch (e) {
    next(e)
  }
}

export const createVariantHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params // product_id
    const variant = await createVariant({ ...req.body, product_id: id as string })

    res.status(201).json(variant)
  } catch (e) {
    next(e)
  }
}

export const updateVariantHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params // variant_id
    const variant = await updateVariant(id as string, req.body)

    res.json(variant)
  } catch (e) {
    next(e)
  }
}

export const deleteVariantHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params // variant_id
    await deleteVariant(id as string)

    res.status(204).send()
  } catch (e) {
    next(e)
  }
}
