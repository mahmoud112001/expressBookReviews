const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: "Customer successfully registered. Now you can login",
      });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop using async/await
public_users.get("/", async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const allBooks = await getBooks;
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Task 2: Get book details based on ISBN using async/await
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBookByIsbn = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });
    const bookDetails = await getBookByIsbn;
    return res.status(200).send(bookDetails);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 3: Get book details based on author using async/await
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const decodedAuthor = author.replace(/%20/g, " ");
      let filtered_books = Object.values(books).filter(
        (book) => book.author.toLowerCase() === decodedAuthor.toLowerCase(),
      );
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject(new Error("Author not found"));
      }
    });
    const filtered_books = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 4: Get all books based on title using async/await
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
      const decodedTitle = title.replace(/%20/g, " ");
      let filtered_books = Object.values(books).filter(
        (book) => book.title.toLowerCase() === decodedTitle.toLowerCase(),
      );
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject(new Error("Title not found"));
      }
    });
    const filtered_books = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
