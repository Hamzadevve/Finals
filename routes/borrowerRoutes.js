const express = require("express");
const {
  addBorrower,
  updateBorrower,
  borrowBook,
  returnBook,
} = require("../controllers/borrowerController");

const router = express.Router();

router.post("/", addBorrower); // Add a new borrower
router.put("/:id", updateBorrower); // Update an existing borrower
router.post("/borrow", borrowBook); // Borrow a book
router.post("/return", returnBook); // Return a book

module.exports = router;
