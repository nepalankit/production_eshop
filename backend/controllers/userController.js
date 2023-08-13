import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
// @desc  auth user
//@route POST /api/users/login
//@acess public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc  register user
//@route POST /api/users
//@acess public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

// @desc  logout user clear cookies
//@route POST /api/users/logout
//@acess private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged Out Successfully" });
});
// @desc  get user profile
//@route get /api/users/profile
//@acess private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // when we are authenticated we have access to req.user
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc  get user profile
//@route PUT /api/users
//@acess private/Admin
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // when we are authenticated we have access to req.user
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      //reason for doing here password is hashed in db so we   only want to mess with it if it is being updated
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc  get users
//@route PUT /api/users
//@acess private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); //empty cuz to find all user
  res.status(200).json(users);
});
// @desc  get user by id
//@route PUT /api/users/:id
//@acess private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password"); //we dont want password
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc  delete users
//@route delete /api/users/:id
//@acess private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted Successfully" });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
// @desc  update user
//@route PUT /api/users/:id
//@acess private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name; //if there is no body then use the same name
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin || user.isAdmin);

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUser,
  getUserById,
  deleteUser,
  updateUserProfile,
};
