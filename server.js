/* The entry point to the backend */
const express = require("express");

const app = express();

/* Adding route  */
/* Can send file with res.sendFile */
app.get("/", (req, res) =>
  res.json({ msg: "Welcome to the contact keeper api" })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
