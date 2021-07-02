# Dev Journal

This is my journal for this project. Just a record for my thoughts and how I might reflect on how some things were implemented.

## Initial project

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
