import { Request, Response, NextFunction } from 'express'
import { fetchProducts } from './product.repo'

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await fetchProducts()
    res.json(products)
  } catch (e) {
    next(e)
  }
}
