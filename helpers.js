const generateRandomString = function() { //creates random 6 random alphanumeric characters
  return Math.random().toString(36).slice(2,8);
};

const emailMatch = function(obj, email) { //return true if email matches user database
  for (const user in obj) {
    if (obj[user].email === email) {
      return true;
    }
  }
  return false;
};

const passwordMatch = function(obj, email) { //returns true if password matches user database
  for (const user in obj) {
    if (obj[user].email === email) {
      return obj[user].password;
    }
  }
};

const idFinder = function(obj, email) {
  for (const user in obj) {
    if (obj[user].email === email) {
      return obj[user].id;
    }
  }
};

const findData = function (obj, id) {
  let userURL = {};
  for (const url in obj) {
    if (obj[url].userID === id){
      userURL[url] = {
        longURL: obj[url].longURL, 
        userID: obj[url].userID
      }
    }
  }
  return userURL;
};
module.exports = { generateRandomString, emailMatch, passwordMatch, idFinder, findData }