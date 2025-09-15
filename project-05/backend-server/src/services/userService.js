require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { name } = require("ejs");
const e = require("express");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        EC: 2,
        EM: "Password is incorrect",
      };
    }
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return { EC: 0, access_token: token, user: payload };
  } catch (error) {
    throw new Error("Error logging in");
  }
};

const getUserService = async () => {
  try {
    const user = await User.find({}).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};
const getDetailUser = async (email) => {
  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user details");
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  getDetailUser,
};
