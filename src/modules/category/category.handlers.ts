import { Request, Response, NextFunction } from 'express'
import {
  fetchCategories,
  fetchRootCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from './category.repo'

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { business_id } = req.query
    const categories = await fetchCategories(business_id as string)
    res.json(categories)
  } catch (e) {
    next(e)
  }
}

export const getRootCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { business_id } = req.query
    const categories = await fetchRootCategories(business_id as string)
    res.json(categories)
  } catch (e) {
    next(e)
  }
}

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const category = await fetchCategoryById(id as string)
    res.json(category)
  } catch (e) {
    next(e)
  }
}

export const createCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, business_id, parent_id } = req.body
    if (!name || !business_id) {
      res.status(400).json({ error: 'Name and business_id are required' })
      return 
    }
    const category = await createCategory({ name, business_id, parent_id })
    res.status(201).json(category)
  } catch (e) {
    next(e)
  }
}

export const updateCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, parent_id } = req.body
    const category = await updateCategory(id as string, { name, parent_id })
    res.json(category)
  } catch (e) {
    next(e)
  }
}

export const deleteCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await deleteCategory(id as string)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}
