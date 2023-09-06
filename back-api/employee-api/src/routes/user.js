const router = require("express").Router();
const { auth } = require("../middleware/auth");
const User = require("../models/user");

//get logged in user

router.get("/me", auth, (req, res) => {
  try {
    const email = req.user.email;
    res.status(200).send(email);
  } catch (error) {
    res.status(500).send();
  }
});

//register user
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();

    res.status(201).send("Successfully registered");
  } catch (error) {
    res.status(400).send("Please send correct information");
  }
});

//login as existing user

router.post("/login", async (req, res) => {
  try {
    const user = await User.findUser(req.body.email, req.body.password);
    const token = user.generateToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send("Unable to login!");
  }
});

//change password

router.patch("/changePassword", auth, async (req, res) => {
  try {
    req.user.password = req.body.password;
    await req.user.save();
    res.send("Password changed");
  } catch (error) {
    res.status(400).send("Unable to change password!");
  }
});

module.exports = router;
