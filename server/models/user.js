import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "seller"], // only these two roles allowed
      default: "user",
    },
    cartItem: {
      type: Object,
      default: {},
    },
  },
  { minimize: false, timestamps: true } // added timestamps for tracking
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
