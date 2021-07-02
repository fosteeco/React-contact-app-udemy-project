/* Login authenticaion, and route to check the logged in user */

/* register route  */
const express = require("express");
const router = express.Router();

// Same thing as mern stack course

// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
router.get("/", (req, res) => {
  res.send("Get logged in user");
});

// @route       POST api/auth
// @desc        Auth user and get token
// @access      Public
router.post("/", (req, res) => {
  res.send("Log in user");
});

module.exports = router;
