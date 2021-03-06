/* The entry point to the backend */
const { Router } = require("express");
const express = require("express");
const { connect } = require("mongoose");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
//init MiddleWare
app.use(express.json({ extended: false }));

// Connect Database
connectDB();

/* Adding route  */
/* Can send file with res.sendFile */

/* app.get("/", (req, res) =>
  res.json({ msg: "Welcome to the contact keeper api" })
); */

//Define Routes
app.use("/api/users", require("././routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

/* Need endpoints that the react application can hit to do certain things  */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
