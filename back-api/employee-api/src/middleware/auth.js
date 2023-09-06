const jwt = require("jsonwebtoken");
const User = require("../models/user");

//check token
const auth = async (req, res, next) => {
  try {
    const access_token = req.headers.authorization.split(" ")[1];
    const userEmail = jwt.verify(access_token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: userEmail });
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Please authenticate!");
  }
};
//check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).send("Not authorized");
  }
};

module.exports = { auth, isAdmin };
