const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const user=users.filter(user=>user.username===username);
    if(user[0]){
        return true;
    }
    else{
        return false;
    }
}     

const authenticatedUser = (username,password)=>{ //returns boolean
let validUser=users.filter(user => user.username==username && user.password==password);
if(validUser){
    return true;
}
else{
    return false;
}
};

//only registered users can login
regd_users.post("/login", async (req,res) => {
  const username=req.body.username;
  const password=req.body.password;
  if(username && password){
      if(authenticatedUser(username,password)){
          let accessToken=jwt.sign({data:password},'access',
          {expiresIn: 60 * 60 * 60});

          req.session.authorization={accessToken,username};
          res.status(200).send("User Successfully Logged in.");
      }
      else{
          res.status(208).json({message:"Inavlid Login Credentials"});
      }
    }
    else{
        res.status(404).json({message:"Error Logging in"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const review=req.body.review;
  const username=req.session.authorization['username'];
  books[isbn].reviews[username]=review;
  res.send("Review Successfully Added/Modified by "+username);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn=req.params.isbn;
    const username=req.session.authorization['username'];
    delete books[isbn].reviews[username];
    res.send("Review Successfully Deleted by "+username);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
