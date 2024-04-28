import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      //   console.log(message.error);
      res.status(401).json({ message: "Not authorized, invalid token" });
      return;
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }
});

export { protect };
