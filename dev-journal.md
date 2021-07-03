# Dev Journal

This is my journal for this project. Just a record for my thoughts and how I might reflect on how some things were implemented.

## 39. Dependencies & Basic Express

Began the project with a

```
npm init -y
```

- Need [Mongo DB cloud](https://www.mongodb.com/cloud)
- npm packages

  - express
    WEB framework, handles our routing
  - Bcryptjs
    Handles hashing passwords
  - jsonwebtoken
    Create a jwt to send back and forth to access protected routes on backend
  - express-validator
    Validates any body data thats coming in, email , password etc.
  - mongoose
    Abstraction layer to interact w/ database, allows you to create models
    ```
    npm i express bcrypt jsonwebtoken config express-validator mongoose
    ```

- npm dep dependencies

  - nodemon
    Allows you to keep watching server, don't have to manually refresh page every time
  - concurrently
    Allows you to run backend and frontend server at same time
    ```
    npm i -D nodemon concurrently
    ```

- Added start and server to scripts section of package.json

```
  "start": "node server.js",
  "server": "nodemon server.js",
```

This allows us to start the express server wtih

```
npm run server
```

### Express testing

Looks like you can do some pretty neet stuff with express()
You call it in using a different syntax than your standard import React from "react"; (has to do with ES6 and versions)
First you have to create an express object, in this case we call it app

```
const express = require("express");
const app = express():
```

You can then have the app respond to GET responses by using the .get() method

```
app.get("/", (req,res) => res.join({msg : "Welcome to the contact keeper api" }));
```

When you send a GET request, you'll receive a json with {msg: "Welcome to the conact keeper api"}.
Seems like my postman won't get the new results unless I restart the server completely.

## 40. Backend Routes

Registering routes in express JS is pretty simple.
it follows this syntax:

```
const express = require("express");
const router = express.Router();

// @route       GET api/contacts
// @desc        Get all users contacts
// @access      Private
router.get("/", (req, res) => {
  res.send("Get all contacts");
});

```

This example was taken from /routes/contacts.js. The syntax above using @route, @desc, @access is what Brad suggests to make the code easy to read.
The server.js file acceses this using this syntax:

```
app.use("/api/contacts", require("./routes/contacts"));
```

Other http methods can also be defined like POST, PUT, and DELETE

## 41. Connect MongoDB To Our App

This part went over the /config/db.js file which includes settings for connecting to the mongoDB cloud instance. The config package allows us to define our mongoURI in the /config/default.json file. Here's what the json file looks like :

```
{
  "mongoURI": "<your.mongodb.clusterURL.that.you.got.from.the.website"
}
```

## 42. User Model & Validation

This video had a lot going on. First we created the model for Users in the file /models/User.js . With the mongoose package we can define the field that we want in our model. Once that was created we brought it into our /routes/users.js file. In here we brought in our express validator using this statement:

```
const { check, validationResult } = require("express-validator");
```

In our post method we created an array of check functions:

```
[
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email ").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ]
```

To test our code we used Postman to send an http request. We first have to include these two lines to be able to use middleware as a testing mechanism:

```
//init MiddleWare
app.use(express.json({ extended: false }));

```

With our anonymous function (req, res) in users.js we use validationResult on the req to see if it produced any errors. Here's what that looks like :

```
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // res.send(req.body);
    res.send("passed");
  }
```

Postman is a pretty neat tool for testing this stuff. In the body section of our request we can send a json object with the name,email,and password fields. If any fail the server returns an array containing the errors.
That ties up this section.

## 43. Hash Passwords & Register Route

Aight this section was neat. We got to store a user to our database. All of the work was done in the /routes/users.js file. After user successfully submits a form we check our database to see if their email already exists. If it does we throw an error. Else we create a new user with their information.

Next we create a salt that will hash our passwords so we don't store passwords as plain text. BIG no no.
the user.password is set to the salted version then we use user.save() to store it to the database.

If we encounter an error at any point because of all the functions that return promises, the end user will not see the message. They will see a status 500 server error. The true error is logged to the console.

## 44. Create & Respond With JSON Web Token

We need these tokens to verify the logged in user. [jwt](https://jwt.io/). We use the user's id as the payload. The secret used to generate this token is kept in the /config/default.json file. To access this we use the config package. We also pass an object with any options we want as parameters with their value. Here's what was added to default.json:

```
"jwtSecret": "supersecretverycomplexpassword"
```
