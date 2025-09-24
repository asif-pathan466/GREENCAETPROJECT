import jwt from 'jsonwebtoken'

const authSeller = async (req, res, next) => {
    const {sellerToken} = req.cookies;

    if(!sellerToken){
        return res.json({success: false, message: "Not Authorized" })
    }
    try {
        // Verify token
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    
        if (decoded.email === process.env.SELLER_EMAIL) {
          req.user = { id: decoded.id }; // safer than putting it inside req.body
          return next();
        } else {
          return res.status(401).json({ success: false, message: "Not authorized" });
        }
    
      } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
      }
}

export default authSeller
 