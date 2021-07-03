/* register route  */
const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Same thing as mern stack course

// @route       POST api/users
// @desc        register a user
// @access      Public
// -> anything that goes to api/users is gonna be forwarded to this file
router.post(
  "/",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email ").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // res.send(req.body);
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({
        email,
      }); /* would be { email: email} but es6 allows {email} */
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(
        password,
        salt
      ); /* Now a hashed version of the password  */
      await user.save();
      res.send("User saved to DB");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error"); /* 500 status is server error duy */
    }
  }
);

module.exports = router;
