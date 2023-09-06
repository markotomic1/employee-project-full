const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    validate(value) {
      const regex = /^([a-z0-9\.]+)@(waltercode\.com)$/;
      if (!regex.test(value)) {
        throw new Error("Email not valid");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
});
// hash password if modified before saving it to db
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 10);

    user.password = hash;
  }
  next();
});
//find user in db and check password
userSchema.statics.findUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};
//prevent client from seeing all info about user
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject._id;
  delete userObject.role;

  return userObject;
};

//generate token
userSchema.methods.generateToken = function () {
  const user = this;

  const token = jwt.sign(user.email, process.env.JWT_SECRET);

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
