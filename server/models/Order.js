import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'product' },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'address' },
    status: {
      type: String,
      enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Order Placed',
    },
    paymentType: {
      type: String,
      enum: ['COD', 'Card', 'UPI', 'Wallet'],
      required: true,
    },
    isPaid: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model('order', orderSchema);
export default Order;
