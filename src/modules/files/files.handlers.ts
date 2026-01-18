import { Request, Response, NextFunction } from 'express'
import { supabase } from '../../config/supabase'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

export const uploadFileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const start = Date.now()
    const file = req.file
    const fileExt = path.extname(file.originalname)
    const fileName = `${Date.now()}-${uuidv4()}${fileExt}`
    const filePath = `uploads/${fileName}`

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      })

    if (error) {
      throw error
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    res.status(201).json({
      url: publicUrlData.publicUrl,
      path: filePath,
      size: file.size,
      mimetype: file.mimetype,
      filename: fileName
    })
  } catch (e) {
    next(e)
  }
}

export const deleteFileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filePath = req.params.path as string
    if (!filePath) {
      res.status(400).json({ error: 'File path is required' })
      return
    }

    // We assume the filePath passed matches what is stored in Supabase (e.g., "uploads/filename.ext")
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath])

    if (error) {
      throw error
    }

    res.status(200).json({ message: 'File deleted successfully', path: filePath })
  } catch (e) {
    next(e)
  }
}
