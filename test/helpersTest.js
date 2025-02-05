const { assert } = require('chai');

const { emailMatch, passwordMatch, idFinder, findData } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID'},
  "9sm5xK": {longURL: "http://www.google.com", userID: 'AVERY' }
};

describe('emailMatch', function() {
  it('should return true if email is found in the data', function() {
    const user = emailMatch(testUsers, "user@example.com")
    assert.isTrue(user)
  });

  it('should return false if email is not found in data', () => {
    const user = emailMatch(testUsers, "user123@example.com")
    assert.isFalse(user)
  });

  it('should return false if email is an empty string', () => {
    const user = emailMatch(testUsers, "")
    assert.isFalse(user)
  });
});

describe('passwordMatch', () => {
  it('should return the matching password with the provided email', () => {
    const actual = passwordMatch(testUsers, "user@example.com");
    const expected = "purple-monkey-dinosaur";
    assert.equal(actual, expected);
  });

  it('should return undefined when no match is found', () => {
    const actual = passwordMatch(testUsers, "user123@example.com");
    
    assert.isUndefined(actual)
  });

  it('should return undefined when email is an empty string', () => {
    const actual = passwordMatch(testUsers, "");
    assert.isUndefined(actual)
  });
});

describe('idFinder', () => {
  it('should return the matching id with the provided email', () => {
    const actual = idFinder(testUsers, "user@example.com");
    const expected = 'userRandomID';
    assert.equal(actual, expected);
  });

  it('should return undefined if no match is found', () => {
    const actual = idFinder(testUsers, "user123@example.com");
    assert.isUndefined(actual)
  });

  it('should return undefined if no match is found', () => {
    const actual = idFinder(testUsers, "");
    assert.isUndefined(actual)
  });
});

describe('findData', () => {
  it('should return the user longURL and id in an object', () => {
    const actual = findData(urlDatabase, 'userRandomID');
    const expected = {"b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID'}};
    assert.deepEqual(actual, expected);
  });

  it('should return an empty object if user id is not found', () => {
    const actual = findData(urlDatabase, 'userRandomIDsada');
    const expected = {};
    assert.deepEqual(actual, expected);
  });

});