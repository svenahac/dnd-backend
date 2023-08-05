const supabase = require("../supabaseClient");
const express = require("express");
const session = require("express-session");
const users = express.Router();

users.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
    cookies: {
      expires: 60 * 2,
    },
  })
);

users.get("/login", (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    res.send({
      logged: true,
      user: req.session.user,
    });
  } else {
    res.send({
      logged: false,
    });
  }
});

async function authUser(username) {
  let { data: users, error } = await supabase
    .from("User")
    .select("*")
    .eq("username", username);
  if (error) {
    console.log(error);
  } else {
    return users;
  }
}

users.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let isUserComplete = username && password;
  if (isUserComplete) {
    try {
      let queryResult = await authUser(username);
      if (queryResult.length > 0) {
        if (password === queryResult[0].password) {
          console.log(queryResult[0]);
          req.session.user = queryResult[0];
          res.json(queryResult[0].username);
          console.log("SESSION VALID");
        } else {
          console.log("INCORRECT PASSWORD!!!");
        }
      } else {
        console.log("USER NOT REGISTERED");
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    console.log("Please enter username and password!!!");
  }
  res.end();
});

async function addUser(
  username,
  email,
  password,
  first_name,
  last_name,
  date_of_birth
) {
  let { data, error } = await supabase
    .from("User")
    .insert([
      {
        username: username,
        email: email,
        password: password,
        name: first_name,
        last_name: last_name,
        date_of_birth: date_of_birth,
      },
    ])
    .single();
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

users.post("/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let date_of_birth = req.body.date_of_birth;
  let isUserComplete = username && password && email && first_name && last_name;
  if (isUserComplete) {
    try {
      let queryResult = await addUser(
        username,
        email,
        password,
        first_name,
        last_name,
        date_of_birth
      );
      if (queryResult !== null) {
        console.log("New user added!");
      }
    } catch (err) {
      console.log(err);
      console.log("Error adding new user!");
      res.sendStatus(500);
    }
  } else {
    console.log("A field is missing!");
  }
  res.end();
});

users.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("connect.sid");
      res.session = null;
      req.session = null;
      res.cookie = null;
      res.send({
        logged: false,
      });
      console.log(req.session);
      console.log("SESSION DESTROYED");
    }
  });
});

module.exports = users;
