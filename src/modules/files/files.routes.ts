import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { uploadFileHandler, deleteFileHandler } from './files.handlers'

const router = Router()

// Multer configuration: store in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  },
})

// POST /api/files/upload
router.post(
  '/upload',
  authMiddleware,
  requireRole(['admin', 'staff']),
  upload.single('file'),
  uploadFileHandler
)

// DELETE /api/files/:path
router.delete(
  /^\/(.*)/,
  authMiddleware,
  requireRole(['admin']),
  deleteFileHandler
)

export const filesRoutes = router
