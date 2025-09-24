import User from "../models/user.js";

// ✅ Cart update controller
export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ obtained from auth middleware
    const { cartItem } = req.body;

    await User.findByIdAndUpdate(userId, { cartItem });

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
