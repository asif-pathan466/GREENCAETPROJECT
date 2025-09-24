import mongoose from "mongoose";

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: Array, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Check if model already exists to prevent recompilation errors
const Product = mongoose.models.product || mongoose.model("product", ProductSchema);

export default Product;
