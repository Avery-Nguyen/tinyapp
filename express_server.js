const express = require("express");
const app = express(); //invokes express so we can use it
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //sets template engine to be used

const bodyParser = require("body-parser"); //makes client POST request readable (middleware)
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session') //middleware for Encypt cookies
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const bcrypt = require('bcrypt'); //encrypt password 

const { generateRandomString, emailMatch, passwordMatch, idFinder, findData } = require('./helpers'); //helper functions

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID'},
  "9sm5xK": {longURL: "http://www.google.com", userID: 'AVERY' }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("1234", 10)
  }
};

app.listen(PORT, () => { //lets us know that the server is on
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => { 
  if (req.session.user_id){
    return res.redirect('/urls');
  }
  return res.redirect('/login');
});

app.get("/urls", (req, res) => { //shows table of the url database based on user_id
  if (req.session.user_id) {
    const account = users[req.session.user_id]; //checks to see if client exist in array, if so shows the login header
    const userURL = findData(urlDatabase, req.session.user_id)
    let templateVars = {
      urls: userURL,
      users,
      account
    };
    return res.render("urls_index", templateVars);
  } 
  return res.redirect("/login");
});

app.get("/urls/new", (req, res) => { //creates new url page for client to input url into form
  if (req.session.user_id) {
    const account = users[req.session.user_id];
    let templateVars = {
      urls: urlDatabase,
      users,
      account
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});


app.get("/urls/:shortURL", (req, res) => { //user request :shortURL and server returns details page of url
  if(!req.session.user_id) {
    return res.status(400).send("Please Login"); //error message
  };
  if(!urlDatabase[req.params.shortURL]) {
    return res.status(400).send("URL Does Not Exist"); //error message
  }
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
  const account = users[req.session.user_id];
  let templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,
    users,
    account
  };
   return res.render("urls_show", templateVars);
} 
  return res.status(401).send("Do Not Have Access"); //error message

});

app.get("/register", (req, res) => {  //send client to register page
  const account = users[req.session.user_id];
  let templateVars = {
    users,
    account
  };
  res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
  res.render('urls_login');
});

app.get("/u/:shortURL", (req, res) => { //redirects to the website that they shorten the url for
  if(!urlDatabase[req.params.shortURL]){
    return res.status(400).send("URL does not exist"); //error message
  }
  return res.redirect(urlDatabase[req.params.shortURL].longURL);
});


app.post("/urls", (req, res) => { //adds new url to database, userID specific
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL:req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);         //redirects client to new page
});

app.post("/urls/:shortURL/delete", (req, res) => { //deletes from database when client clicks button
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
  delete urlDatabase[req.params.shortURL];
  return res.redirect("/urls");
  }
  return res.status(401).send("cannot delete"); //error message
});

app.post("/urls/:shortURL/edit", (req, res) => { //edits the long URL to a different URL when client clicks edit
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  return res.redirect("/urls");
  }
  return res.status(401).send("cannot edit"); //error message
});

app.post("/login", (req, res) => { //checks login information to see if it matches user object
  if (emailMatch(users, req.body.email) && bcrypt.compareSync(req.body.password, passwordMatch(users, req.body.email))) {
    const id = idFinder(users, req.body.email);
    req.session.user_id = id;
    res.redirect("/urls");
  } else {
    res.redirect(400, "/login"); //error message
  }
  
});

app.post("/logout", (req, res) => { //clears the cookie of the user_id
  res.clearCookie('session');
  res.redirect("/urls");
});


app.post("/register", (req, res) => { //creates new user object with cookie
  const randID = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
    res.redirect(400, "/login"); //error message
  } else if (emailMatch(users, req.body.email)) {
    res.redirect(400, "/login"); //error message
  } else {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    users[randID] = {
      id: randID,
      email: req.body.email,
      password: hashedPassword
    };
    req.session.user_id = randID;
    res.redirect("/urls");
  }
});


