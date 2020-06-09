const express = require("express");
const app = express(); //invokes express so we can use it
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //sets template engine to be used

const bodyParser = require("body-parser"); //makes client POST request readable (middleware)
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser'); //middleware for cookies
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const user = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  }
};

app.get("/", (req, res) => { //send client a reponse once they make a request
  res.send("Hello!");
});

app.listen(PORT, () => { //lets us know that the server is on
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => { //send json of the url database
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => { //hello page
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => { //shows table of the url database
  let templateVars = { 
    urls: urlDatabase,
    username: req.body.user_id
   };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { //creates new url page for client to input url into form
  let templateVars = { 
    urls: urlDatabase,
    username: req.body.user_id
   };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => { //user request :shortURL and server returns details page of url
  let templateVars = { 
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    username: req.body.user_id
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => { //redirects to the website that they shorten the url for
  // const longURL = ...
  res.redirect(urlDatabase[req.params.shortURL]);
});

function generateRandomString() { //creates random 6 random alphanumeric characters
  return Math.random().toString(36).slice(2,8);
}

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); //invokes generateRandomString to create short url
  urlDatabase[shortURL] = req.body.longURL; // adds shorturl and long url key/values pair to database (urlDatabase object)
  res.redirect(`/urls/:${shortURL}`);         //redirects client to new page
});

app.post("/urls/:shortURL/delete", (req, res) => { //deletes from database when client clicks button
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => { //edits the long URL to a different URL when client clicks edit
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls");
});

app.post("/login", (req, res) => { //req.body.username = recieves the username the client submitted
  // console.log(req.body.username);
  res.cookie('username', req.body.username); 
  // console.log(req.cookies["username"]); // value = avery
  res.redirect("/urls");
});

app.post("/logout", (req, res) => { //clears the cookie of the username
  res.clearCookie('username', req.body.username);
  res.redirect("/urls");
});

app.get("/register", (req, res) => {  //send client to register page
  let templateVars = { 
    username: user
   };
  res.render('urls_register', templateVars);
});

app.post("/register", (req, res) => {
  const randID = generateRandomString();
  user[randID] = {
    id: randID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_id', randID);
  res.redirect("/urls");
  console.log(req.body.user_id);
});
