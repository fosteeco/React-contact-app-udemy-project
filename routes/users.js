/* register route  */
const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // res.send(req.body);
    res.send("passed");
  }
);

module.exports = router;
