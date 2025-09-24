import express from 'express'
import authUser from '../middlewears/authUser.js'
import { getAllOrders, getUserOrders, placeOrderCod, placeOrderStripe } from '../controllers/orderController.js'
import authSeller from '../middlewears/authSeller.js'

const orderRouter = express.Router()

orderRouter.post('/cod', authUser, placeOrderCod)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/stripe', authUser, placeOrderStripe)


export default orderRouter