import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

// register user:  /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing details"
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, password: hashPassword })

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    })

    return res.json({
      success: true,
      user: { email: user.email, name: user.name }
    })
  } catch (error) {
        console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// Login user : /api/user/login

export const login = async (req,res) => {
 
  try {
    const {email, password} = req.body

    if(!email || !password)
      return res.json({success: false, message: "email and password is required"})

    const user = await User.findOne({email})
  
    if(!user){
      return res.json({success: false, message: "invalid email and password "})
    }
    
    const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch)
    return res.json({success: false, message: "invalid email or password"})

  const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    })

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
      message: "Login Successfully"
    })
  } catch (error) {
    console.log(error.message)
      res.json({ success: false, message: error.message })
  }
}


// check Auth: /api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    const userId = req.user.id; // comes from middleware (authUser)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user, // return user details except password
    });
  } catch (error) {
    console.log("users controller file",error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// logout user: /api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



