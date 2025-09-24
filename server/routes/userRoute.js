import express from 'express'
import { isAuth, login, logout, register } from '../controllers/userController.js'
import authUser from '../middlewears/authUser.js' // ✅ corrected folder name

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected route
router.get('/is-auth', authUser, isAuth)
router.get('/logout', authUser, logout)

export default router
