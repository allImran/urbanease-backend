import { Request, Response, NextFunction } from 'express'
import {
  createTempUser,
  fetchTempUserById,
  fetchTempUserByPhone,
  updateTempUser,
  searchTempUsers
} from './temp-user.repo'

export const createTempUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, address } = req.body

    // Check if user with this phone already exists
    const existingUser = await fetchTempUserByPhone(phone)
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A user with this phone number already exists',
        details: { existing_user_id: existingUser.id }
      })
    }

    const user = await createTempUser({ name, phone, address })
    res.status(201).json(user)
  } catch (e) {
    next(e)
  }
}

export const updateTempUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Check if user exists
    const existingUser = await fetchTempUserById(id as string)
    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Temp user not found'
      })
    }

    // If phone is being updated, check for duplicates
    if (updates.phone && updates.phone !== existingUser.phone) {
      const phoneExists = await fetchTempUserByPhone(updates.phone)
      if (phoneExists) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'A user with this phone number already exists'
        })
      }
    }

    const user = await updateTempUser(id as string, updates)
    res.json(user)
  } catch (e) {
    next(e)
  }
}

export const searchTempUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, page, limit } = req.query

    const result = await searchTempUsers({
      search: search as string | undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    })

    res.json(result)
  } catch (e) {
    next(e)
  }
}

export const getTempUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const user = await fetchTempUserById(id as string)
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Temp user not found'
      })
    }

    res.json(user)
  } catch (e) {
    next(e)
  }
}
