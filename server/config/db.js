import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Pass the options object as the second argument
    await mongoose.connect(process.env.MONGODB_URI, {
      
    }); 
    
    console.log("✅ Database connected successfully to greencart");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
};