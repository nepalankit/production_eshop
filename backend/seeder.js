import mongoose from "mongoose";

import dontenv from "dotenv";
import users from "./Data/users.js";
import products from "./Data/products.js";
import User from "./models/userModel.js";
import Order from "./models/orderModel.js";
import conncectDB from "./config/db.js";
import Product from "./models/productModel.js";
dontenv.config();
conncectDB(process.env);

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminuser = createdUsers[0]._id;
    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminuser,
      };
    });
    await Product.insertMany(sampleProducts); //insert all products in database
    console.log("Data Imported !");
    process.exit();
  } catch (error) {
    console.log(`Error : ${error}`);
  }
};
const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.log(`Error : ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
