/* The entry point to the backend */
const { Router } = require("express");
const express = require("express");

const app = express();

/* Adding route  */
/* Can send file with res.sendFile */
app.get("/", (req, res) =>
  res.json({ msg: "Welcome to the contact keeper api" })
);
//Define Routes
app.use("/api/users", require("././routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

/* Need endpoints that the react application can hit to do certain things  */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
