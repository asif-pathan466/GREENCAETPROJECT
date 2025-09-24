import Order from "../models/order.js";
import Product from "../models/product.js";
import Stripe from "stripe";
import user from '../models/user.js'

// Place COD order
export const placeOrderCod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address } = req.body;

    if (!address || !items || !items.length) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      amount += product.offerPrice * item.quantity;
    }

    amount = Math.round(amount * 1.02); // 2% tax

    const order = await Order.create({
      userId,
      items: items.map(i => ({ product: i.productId, quantity: i.quantity })),
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
    });

    return res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Place Stripe order
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!address || !items || !items.length) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    let productData = [];
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });

      productData.push({ name: product.name, price: product.offerPrice, quantity: item.quantity });
      amount += product.offerPrice * item.quantity;
    }

    amount = Math.round(amount * 1.02);

    const order = await Order.create({
      userId,
      items: items.map(i => ({ product: i.productId, quantity: i.quantity })),
      amount,
      address,
      paymentType: "Card",
      isPaid: false,
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 1.02 * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: { orderId: order._id.toString(), userId },
    });

    return res.status(201).json({ success: true, url: session.url });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// STRIPE WEBHOOK to verify payments actions : /stripe
 export const stripeWebHooks = async (request, response) => {
  //Stripe getway initilize
   const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

   const sig = request.headers["stripe-signature"]
   let event;

   try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
   } catch (error) {
    response.status(400).send(`webhook Error: ${error.message}`)
   }

   //handle the event
    switch (event.type) {
      case "payment_intent.succeeded":{
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

          // getting session meta data

          const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
          })

          const {orderId, userId} = session.data[0].metadata;
          //mark payment is paid

          await Order.findByIdAndUpdate(orderId, {ispaid: true})

          // clear user cart
          await user.findByIdAndUpdate(userId, {cartItems: {}})

           break;
      }
        
         case "payment_intent.succeeded": {
           const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

          // getting session meta data

          const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
          })

          const {orderId} = session.data[0].metadata;

          await Order.findByIdAndDelete(orderId)
          break;
         }
    
      default:
        console.error(`unhandle event type ${event.type}`)
        break;
    }

    response.json({received: true})
 }

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("FETCH ORDERS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (admin/seller)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ $or: [{ paymentType: "COD" }, { isPaid: true }] })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
