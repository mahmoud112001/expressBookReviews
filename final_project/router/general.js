const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Register a new user
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

// Task 1: Get the book list available in the shop (async/await)
public_users.get("/", async function (req, res) {
  try {
    const allBooks = await new Promise((resolve) => resolve(books));
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Task 2: Get book details based on ISBN (async/await)
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const bookDetails = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });
    return res.status(200).send(JSON.stringify(bookDetails, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 3: Get book details based on author (async/await)
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const filtered_books = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author.toLowerCase(),
      );
      if (result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("Author not found"));
      }
    });
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 4: Get all books based on title (async/await)
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const filtered_books = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title.toLowerCase(),
      );
      if (result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("Title not found"));
      }
    });
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).send(JSON.stringify(book.reviews, null, 4));
});

// ---------------------------------------------------------------
// Axios client functions (async/await) that call the endpoints above
// ---------------------------------------------------------------

// Task 10: Get all books using Axios
const getAllBooks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
};

// Task 11: Get book details by ISBN using Axios
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching book by ISBN:", error.message);
  }
};

// Task 12: Get books by author using Axios
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(author)}`,
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
  }
};

// Task 13: Get books by title using Axios
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/title/${encodeURIComponent(title)}`,
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
  }
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
