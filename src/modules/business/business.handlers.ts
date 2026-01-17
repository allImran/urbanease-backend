import { Request, Response, NextFunction } from 'express'
import {
  fetchBusinesses,
  fetchBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness
} from './business.repo'

export const getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businesses = await fetchBusinesses()
    res.json(businesses)
  } catch (e) {
    next(e)
  }
}

export const getBusiness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const business = await fetchBusinessById(id as string)
    res.json(business)
  } catch (e) {
    next(e)
  }
}

export const createBusinessHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug } = req.body
    if (!name || !slug) {
      res.status(400).json({ error: 'Name and slug are required' })
      return 
    }
    const business = await createBusiness({ name, slug })
    res.status(201).json(business)
  } catch (e) {
    next(e)
  }
}

export const updateBusinessHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, slug } = req.body
    const business = await updateBusiness(id as string, { name, slug })
    res.json(business)
  } catch (e) {
    next(e)
  }
}

export const deleteBusinessHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await deleteBusiness(id as string)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}
