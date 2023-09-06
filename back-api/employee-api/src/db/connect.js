const mongoose = require("mongoose");
const User = require("../models/user");

//creates admin user if it does not exist
const adminHandler = async () => {
  try {
    let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminUser) {
      adminUser = new User({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });
      await adminUser.save();
    }
  } catch (error) {
    throw new Error(error);
  }
};
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    adminHandler();
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Error when starting db"));
