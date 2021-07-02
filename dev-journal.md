# Dev Journal

This is my journal for this project. Just a record for my thoughts and how I might reflect on how some things were implemented.

## Dependencies & Basic Express

Began the project with a

> npm init -y

- Need [Mongo DB cloud](https://www.mongodb.com/cloud)
- npm packages

  - Express
    WEb framework, handles our routing
  - Bcryptjs
    Handles hashing passwords
  - Jsonwebtoken
    Create a jwt to send back and forth to access protected routes on backend
  - Express-validator
    Validates any body data thats coming in, email , password etc.
  - Mongoose
    Abstraction layer to interact w/ database, allows you to create models
    > npm i express bcrypt jsonwebtoken config express-validator mongoose

- npm dep dependencies

  - nodemon
    Allows you to keep watching server, don't have to manually refresh page every time
  - concurrently
    Allows you to run backend and frontend server at same time

    > npm i -D nodemon concurrently

- Added start and server to scripts section of package.json
  > "start": "node server.js",
  > "server": "nodemon server.js",

### Express testing

Looks like you can do some pretty neet stuff with express()
You call it in using a different syntax than your standard import React from "react"; (has to do with ES6 and versions)
First you have to create an express object, in this case we call it app

> const express = require("expresse")
> const app = express()
> You can then have the app respond to GET responses by using the .get() method
> app.get("/", (req,res) => res.join({msg : "Welcome to the contact keeper api" }))

When you send a GET request, you'll receive a json with {msg: "Welcoem to the conact keeper api"}
