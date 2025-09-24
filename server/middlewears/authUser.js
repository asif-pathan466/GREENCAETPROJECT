import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ success: false, message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.id) {
      req.user = { id: decoded.id };
      next();
    } else {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

export default authUser;
