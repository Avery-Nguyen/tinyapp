const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

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

app.get("/urls/:shortURL", (req, res) => { //user request :shortURL and server returns details page of url
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});