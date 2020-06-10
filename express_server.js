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

const users = {
  "userRandomID": {
                    id: "userRandomID", 
                    email: "user@example.com", 
                    password: "purple-monkey-dinosaur"
                  }
};

const emailMatch = function(obj, email) {
  for(const user in obj){
    if (obj[user].email === email){
      return true;
    } 
  }
  return false
};

const passwordMatch = function(obj, password) {
  for(const user in obj){
    if (obj[user].password === password){
      return true;
    } 
  }
  return false
};

const idFinder = function (obj, email){
  for(const user in obj){
    if (obj[user].email === email){
      return obj[user].id
    } 
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
  const account = users[req.cookies["user_id"]]; //checks to see if client exist in array, if so shows the login header
  let templateVars = { 
    urls: urlDatabase,
    users,
    account
   };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { //creates new url page for client to input url into form
  const account = users[req.cookies["user_id"]];
  let templateVars = { 
    urls: urlDatabase,
    users,
    account
   };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => { //user request :shortURL and server returns details page of url
  const account = users[req.cookies["user_id"]]; 
  let templateVars = { 
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    users,
    account
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

app.post("/login", (req, res) => { //checks login information to see if it matches user object
  if(emailMatch(users, req.body.email) && passwordMatch(users,req.body.password)) {
    const id = idFinder(users, req.body.email);
    res.cookie('user_id', id); 
    res.redirect("/urls");
  } else {
    res.redirect(400, "/login")
  }
  
});

app.post("/logout", (req, res) => { //clears the cookie of the username
  res.clearCookie('user_id', req.cookies["user_id"]);
  res.redirect("/login");
});

app.get("/register", (req, res) => {  //send client to register page
  const account = users[req.cookies["user_id"]];
  let templateVars = { 
    users,
    account
   };
  res.render('urls_register', templateVars);
});

app.post("/register", (req, res) => { //creates new user object with cookie
  const randID = generateRandomString();
  if (req.body.email === "" || req.body.password === ""){
    res.redirect(400, "/urls");
  } else if (emailMatch(users, req.body.email)){
    res.redirect(400, "/urls");
  } else {
    users[randID] = {
      id: randID,
      email: req.body.email,
      password: req.body.password
    };
    res.cookie('user_id', randID);
    res.redirect("/urls");
  }
  // console.log(req.cookies["user_id"]); // = randID
});

app.get('/login', (req, res) => {
  res.render('urls_login')
});
