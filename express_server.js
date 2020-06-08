const express = require("express");
const app = express(); //invokes express so we can use it
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //sets template engine to be used

const bodyParser = require("body-parser"); //makes client POST request readable
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { //creates new url page for client to input url into form
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => { //user request :shortURL and server returns details page of url
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console in js object { longURL: ~longUrl.com~ }
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

function generateRandomString() { //creates random 6 random alphanumeric characters
 return Math.random().toString(36).slice(2,8);
}