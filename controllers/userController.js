import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { json } from "express";

// @desc   Auth user/set token
// route   POST /api/users/auth
// @access public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
});

// @desc   Register a new User
// route   POST /api/users
// @access public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400).json({ message: "User already exist" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});

// @desc   Logout user
// route   POST /api/logout
// @access public

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: " User logged out" });
});

// @desc   Get User Profile
// route   GET/api/user/profile
// @access private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

// @desc   Update User Profile
// route   PUT /api/user/profile
// @access private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
    res.status(200).json({ message: "Update User Profile" });
    return;
  } else {
    res.status(404).json({ message: "User Not Found" });
    return;
  }
});

export {
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
};
