/* register route  */
const express = require("express");
const router = express.Router();

// Same thing as mern stack course

// @route       POST api/users
// @desc        register a user
// @access      Public
// -> anything that goes to api/users is gonna be forwarded to this file
router.post("/", (req, res) => {
  res.send("Registers a user");
});

module.exports = router;
