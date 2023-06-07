const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios=require("axios");
const public_users = express.Router();



public_users.post("/register", async (req,res) => {
  const username=req.body.username;
  const password=req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
  
});
      
//Get the book list available in the shop
public_users.get('/', async function (req, res) {
    await res.send(JSON.stringify(books));
});




// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn=req.params.isbn;
  const book=books[isbn];
  await res.send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const authorParam=req.params.author.split('-');
    const author=authorParam.join(' ').trim();
    const keys=Object.keys(books);
    let booksByAuthor=[];
    for(var i=0;i<keys.length;i++){
        const isbn=keys[i];
        if(books[isbn].author===author){
            booksByAuthor.push(books[isbn]);
        }

    }
    await res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const titleParam=req.params.title.split('-');
    const title=titleParam.join(' ').trim();
    const keys=Object.keys(books);
    let booksByTitle=[];
    for(var i=0;i<keys.length;i++){
        const isbn=keys[i];
        if(books[isbn].title===title){
            booksByTitle.push(books[isbn]);
        }

    }
    await res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  const isbn=req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
