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

## 45. Authenticate Route

This was a neet section. We learned how we can authenticate a user. We copied most of the code from /routes/users.js to /routes/auth.js because they use a lot of the same information. But we only need the email and password now.

We still pass an array of checks. This time we search if the email exists in the database. If we don't we give a 400 error.

Then we check the password with the bcrypt package. Here's what that looks like :

```
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(400).json({ msg: "Invalid credentials" });
}
```

If it passes then we get the Json web token.

## 46. Auth Middleware & Protecting Routes

A new folder middleware was created. This file contains a function that can verify that a "x-auth-token" is in the header of the document. Here is the code that finds it:

```
const token = req.header("x-auth-token");
```

The function also takes in a function called next. This function runs when the authentication is verified. To use this function we import it and pass it into a router method. Here's how we did it in the /routes/auth.js :

```
router.get("/", auth, async (req, res) => {...}
```

In the router function we can use req.user because the auth decodes the jsonwebtoken and sets req.user to decoded.user. Neat stuff.

## 47. Contact Model & Get Contacts Route

So in this w ecreated the file /models/Contact.js . Copied contents of modeles/Users.js as boiler plate. Email no longer unique so that field was removed. The interesting part of this models is referencing the users mongoDB collection:

```
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users" /* <-- The name of mongoDB collection*/,
},
```

Then in the /routes/contacts.js we pull in the auth from /middleware/auth because protected components require authentication. In the get all contacts we pass the auth so we can find the contacts for the user with the correct Jsonwebtoken. Here's what that code is:

```
const contacts = await Contact.find({ users: req.user.id }).sort({
  date: -1,
});
```

This will pull all contacts for that user into an array that sorts by the latest date added.

## 48. Add Contact Route

This section gave me some problems but it was pretty good.

We fleshed out the post method for /routes/contacts.js . Found out you can pass two forms of validation through these app.methods using an array[auth, [check, check,check]]. In this case we only had to check for name because it's just a contact.

Here are some problems I ran into:

ran into annoying issue: contact validation failed: password: Path \`password\` is required
also had an issue with getting all the contacts. I found that it was a typo in the line where it gets all contacts

```
try {
const contacts = await Contact.find({ user: req.user.id }).sort({ /* <--- issue was on this line, was users and should be user as it is now and it works! */
    date: -1,
  });
  res.json(contacts);
} catch (err){...}
```

## 49. Contact Update & Delete Routes

Can now update and delete a contact. All code in this section was in the /routes/contacts.js. Contact fields can be updated independently.

## 50. Setup React & Concurrently

Started with :

```
npx create-react-app client
```

this will create the react app in a folder called client
npm start -> runs react dev server
These scripts were added to package.json

```
"client": "npm start --prefix client",
"clientinstall": "npm install --prefix client",
"dev": "concurrently \"npm run server\" \"npm run client \" ",
```

This was added to the package.json in the react /client folder

```
"proxy": "https://localhost:5000"
```

This allows us to use the proxy name instead of having to type localhost:5000 for everything.
Also added to the git Ignore so we don't uploa the modules that are in the react-app

```
client/node_modules
```

## 51. Cleanup, Navbar & Router Setup

Added more stuff to .gitignore

Installing npm stuff in /client

```
npm i axios react-router-dom uuid react-transition-group
```

- uuid
  -- generates unique ids

New pages were added.

## 52. Contacts Context & Global State

Getting complicated. Want to revisit this section to gain better understanding.
Now we're implementing context for our contacts
We have a state context and reducer setup.\
My vim workflow is superb.
Hardcoding the contacts in state was a breeze. I visually selected the phone number using vi' then did a search and replace using :s/1/2/g .
That was a great vim command. Swapping between termials is also a great feature that I found on this site: https://t.co/1TeTVq3TIc?amp=1 . Same as vim movements so the muscle memory really feels good.

## 53. Contacts & ContactItem Components

Error: Objects are not valid as a React child (found: object with keys {}). If you meant to render a collection of children, use an array instead.
\
This was happpening because in my Homes.js I was using

```
{{/* ContactForm */}}
```

When it should've been

```
{/* ContactForm */}
```

Contact and contactItem components have been implemented. Font seems to not be working

## 54. ContactForm Component

The contact from can now update the information in the DOM. No updates are made throug the backend yet.

The way uuid is imported didn't work for me. I had to do it this way:

```
import { v4 as uuidv4 } from "uuid"; /* Used to generate a random id  */
```

Then I could call the function like this:

```
contact.id = uuidv4();
```

## 55. Delete Contact From UI

Deleting contact is temporary.

## 56. Set & Clear Current Contact

New piece of state is attached called current. This is where the contact that is being edited will be stored. Functions for setting and clearing the current were added.

## 57. Edit & Update Contact Action

Update and edit functional through the UI now.\
I really like the method that was used to update the contacts.\
since the contact array is immutable we create a new array using the .map method Here's the code:

```
contacts: state.contacts.map((contact) =>
  contact.id === action.payload.id ? action.payload : contact
),
```

Just beautiful

## 58. Contact Filter Form & State

We use regular expressions in this section. This was cool to see. We also created a new component for contacts called ContactFilter that creates a search form. We used a hook called useRef. We used it instead of using a piece of state. The useEffect hook was also used to prevent text from staying inside the form

## 59. Basic Add & Delete Animation

Using the react-transition-group we were able to add animations to the contact items.
http://reactcommunity.org/react-transition-group/transition-group

## 60. Auth Context & Initial State

Auth context, state, and reducer were created.
Typing out the types.js stuff is annoying.\
I did a neat vim trick to make it a little easier but haven't found a way to do it that is clean. I recorded a macro that highlights the variable name copies it then pastes it to the bottom of the file. This allowed me to run that macro as much as I needed to get all the variable names so I could import them into the AuthState.js file. It worked well but felt like a hack. The thing is using the mouse would probably be more efficient for that task. But if there are hundreds of variable names vim makes quick work where a mouse would take forever so it's still a good practice to figure out those vim movements.

```
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
```

As you can see you can't make a vertical selection with C-v so you'd probably have to make some regular expression or record a macro. \
Here's the macro I created and stored in my "a" key:

```
0wwveyGA
<Esc>p''j
```

Here's process: goto beginning of line, move forward two words, visually select, go to end of word, yank, go to end of file, go into insert mode on a new line, Exit insert mode, paste, go to previous cursor position, go to new line.

## 61. Register & Login Forms

Register and login forms created in the comoponents/auth folder. Also added links to them in the navbar. Seems like I've got some styling issues. Forms look different than the tutorial.

## 62. Alert Context, State & Component

Alert context, state, component, and reducer implemented. Form validation can be done through the markup or one of our alerts. I think I prefer the minLength attribute in the markup. Writing more code seems unnecessary.

## 63. User Registration

User registration now accesses the database. The register.js component runs a function from AuthState called register.
Had an issue wher axios wasn't sending the request to the correct url. Fixed this by correcting the url in the proxy of the react folder. It contained an https url when it should've been http. Restarting the server made this take effect.
Also had an issue where my alert wasn't working. Restarting the server fixed it.

## 64. Load User & Set Token

Registration will now save the user's information to their browser local storage. Their token and user data is saved to state.

## 65. User Login

User login will now work. Reused most code from Registration.js .

## 66. Logout & Navbar

Was able to pull info about logged in user into the Navbar component by using AuthContext. Still haven't implemented private routes so the home page is visible to all users because when the page runs the load user function the backend api will return a 401 unauthorized because it doesn't have a token.

## 67. PrivateRoute Component

Private route was created. /src/components/PrivateRoute.js is a functional comoponent that takes in a component and other parameters using rest notation. It checks to see if the use is authenticated and they're done loading. They are redirected to login if they aren't authenticated. If they are the component is rendered with the parameters that were passed in.

## 68. Add Contact

Logged in Users can now add contacts and they will be stored in the database. The contact.id is now contact.\_id because that is how mongoDb stores ids for database entries. Headers dont' have to include the x-auth-token because it is stored globally.

## 69. Get & Clear Contacts

Contacts are now pulled from the database when the user logs in. This is done with the contactState. A new function getContacts was used. No headers are needed since it is only a get request and we have the x-auth-token set globally when the user logs in. The reducer sets the contacts to the response.\
We also implemented the loading spinner whenever loading is true. This was copied from the previous project.\
To ensure that contacts are not seen by users who log on the same session we had to implement a clear contacts function. We did this in the contactState again. We just set everything in the state to null. To ensure this function is called when the user logs out we added it to the Navbar component's onLogout function.

## 70. Delete Contacts

To delete a contact from the database we had to update the delet contact function in the contactState. The ContactItem also had to be updated since it pulls the id from contact.id when it is now stored in .\_id because of MongoDB. so we pull it out like :

```
const { _id } = contact;
```

We also updated the way that contacts are added to the array. We put it in front then spread the rest of the current array because MongoDB sorts the items by the latest ones that were added.

## 71. Update Contacts

In contact state we updated the updateContact function to make a put call to our api. We also had to update the reducer to use \_id instead of id because we are using mongoDb's id generation instead of UUID.

## 72. Prepare & Deploy to Heroku

Create and login to heroku account
https://dashboard.heroku.com/
Install Heroku cli
https://devcenter.heroku.com/articles/heroku-cli
To ensure heroku cli is installed run:

```
heroku --version
```

Added this to sever.js

```
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

```

Added new script to package.json:

```
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client",
```

Command line:

```
heroku login
heroku create
git add .
git commit -m "Prepare for deploy"
```

Add heroku as remote repo:

```
heroku git:remote -a yourproject-name
git push heroku main
heroku open
```

Wow so that was a hassle getting it to work. First I made a mistake in that I didn't allow access from any ip address before deployment so I had an error connecting to the mongoDB database. Then I removed my ip address from the ones listed in MongoDB cloud without realizing that I need to add access from anywhere after that. Also I was trying to make a production branch following one of the comments in the video. THey reccomended these instructions: https://github.com/bradtraversy/devconnector_2.0#deploy-to-heroku
Which are actually supper helpful if you follow the correctly.\
I failed to realize that I was still pushing my main github branch when I should've been pushing the production branch. Very silly mistake. But here are the correct commands for that process:

```
git checkout -b production
git add -f config/production.json
git commit -m 'ready to deploy'
heroku create
git push heroku production:main
```

That link even mentions:

> Don't forget to make sure your production database is not whitelisted in MongoDB Atlas, otherwise the database connection will fail and your app will crash.

haha, it pays to pay attention.

## Final thoughts

Well it is fully implemented at
https://cfoster-react-contact-app.herokuapp.com/login \

Overall I enjoyed this project. I had issues here and there but that's all a part of the development process. Following a tutorial really doesn't do much for you anyways. This doesn't mean that I could create this app from scratch or something similar. But it does help me realize what can be done with react and express. It was cool to see how we interact with the database. Soo much of my learning has been about frontend styling and it's really refreshing to see a fullstack setup. Heroku deployment was also interesting. The context, state, and reducer loop was also re-engrained to my memory. The implementation of functional components is also really starting to stick. Like useEffect, useContext, useState are feeling familiar. The JSON webtoken was also a great tool to be exposed to. Writing it to the local storage never needing to write it into the headers was clever. All of these things are pretty fundamental to the react framework. Seeing an implementation is a great way to gain some understanding of how you make it all work together.\
One thing I would've like to see is a real database deployment instead of use MongoCloud. But I understand that these cloud services have some features that allow for great scalability. Still got a lot to learn. Oh yeah and postman is a pretty neat tool for debugging the api and seeing how headers work.\
I also would've like to see a more complex registration process for this app. It kind of sucks that there's no way to reset the password or confirm user accounts. Maybe I could try to implement that to increase my skills with react.

I'm excited to see what the next project in the course has to offer. Gonna be learning redux.
