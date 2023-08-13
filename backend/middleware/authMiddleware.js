import jwt, { decode } from "jsonwebtoken";

import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";
//protect routes

const protect = asyncHandler(async (req, res, next) => {
  let token;

  //Read the jwt from cookie

  token = req.cookies.jwt; //auth(login) route ma jwt xa
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

//admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({ message: "You are not an Admin" });
  }
};

export { protect, admin };
