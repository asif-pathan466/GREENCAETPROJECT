import Address from "../models/address.js"


// add address: /api/address/add

export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    await Address.create({ ...address, userId: req.user.id });

    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// get address: /api/address/get
export const getAddress = async (req, res) => {
    try {
        // Get userId from auth middleware
        const userId = req.user.id;

        const addresses = await Address.find({ userId });
        res.json({ success: true, addresses });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
