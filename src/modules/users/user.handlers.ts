import { Request, Response, NextFunction } from 'express'
import { supabase } from '../../config/supabase'

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    // Update profile. Triggers in the DB will handle syncing to auth.users metadata.
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      // Pass Supabase errors to global handler
      throw error 
    }

    if (!data) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'Role updated successfully', user: data })
  } catch (error) {
    next(error)
  }
}
