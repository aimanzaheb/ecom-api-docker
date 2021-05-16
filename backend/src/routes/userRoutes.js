import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js'

import { authToken, authAdmin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(authToken, authAdmin, getUsers)
router.post('/login', authUser)
router
  .route('/profile')
  .get(authToken, getUserProfile)
  .put(authToken, updateUserProfile)
router
  .route('/:id')
  .delete(authToken, authAdmin, deleteUser)
  .get(authToken, authAdmin, getUserById)
  .put(authToken, authAdmin, updateUser)

export default router
