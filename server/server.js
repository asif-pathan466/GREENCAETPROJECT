import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js';
import 'dotenv/config'
import router from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRouter.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebHooks } from './controllers/orderController.js';

const app = express()

 const port = process.env.PORT || 4000;

await connectDB()

await connectCloudinary()

//allow multiple origins

 const allowedOrigins = ['http://localhost:5173']

 app.post('/stripe', express.raw({type: 'application/json'}), stripeWebHooks)

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // ✅ fix from Credential → credentials
}));

 app.get('/', (req,res) => res.send("Api is working"))

 //register user:  /api/user/register
 app.use('/api/user', router)
 app.use('/api/seller', sellerRouter)
  app.use('/api/product', productRouter)
    app.use('/api/cart', cartRouter)
        app.use('/api/address', addressRouter)
                app.use('/api/order', orderRouter)






 app.listen(port, () => {
    console.log(`app running on http://localhost:${port}`)
 })