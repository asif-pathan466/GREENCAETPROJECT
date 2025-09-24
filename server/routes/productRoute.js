import express from 'express'
import { upload } from '../config/multer.js'
import authSeller from '../middlewears/authSeller.js'
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js'

const productRouter = express.Router()

// Add product (seller must be authenticated)
productRouter.post('/add', authSeller, upload.array("images"), addProduct)

// Get all products
productRouter.get('/list', productList)

// Get single product by ID
productRouter.get('/:id', productById)

// Change product stock (seller only)
productRouter.post('/stock', authSeller, changeStock)

export default productRouter
