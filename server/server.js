import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Configuration & DB
import { connectDB } from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import router from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebHooks } from "./controllers/orderController.js";

// --- INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = ["http://localhost:5173"];

// --- WEBHOOKS ---
// Special Rule: Stripe needs "raw" data, so this must come before express.json()
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

// --- MIDDLEWARES ---
app.use(express.json());       // Parse JSON bodies
app.use(cookieParser());       // Parse cookies for auth
app.use(cors({                 // Handle cross-origin requests
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));

// --- API ROUTES ---
app.get("/", (req, res) => res.send("✅ API is working"));

app.use("/api/user", router);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// --- SERVER LIFECYCLE ---
const startApp = async () => {
  try {
    // 1. Connect to external services first
    await connectDB();
    await connectCloudinary();

    // 2. Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚀 Server launched on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Critical failure during startup:", error.message);
    process.exit(1); // Stop the process if we can't connect to DB
  }
};

startApp();