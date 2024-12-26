const Book = require("../models/Book");
const Author = require("../models/Author");

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn, availableCopies } = req.body;

    const authorObj = await Author.findById(author);
    if (!authorObj) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Ensure author has no more than 5 books
    const booksCount = await Book.countDocuments({ author });
    if (booksCount >= 5) {
      return res.status(400).json({ error: "Author cannot be linked to more than 5 books" });
    }

    const book = new Book({ title, author, isbn, availableCopies });
    await book.save();

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get books with borrowing frequency > 10 and copies > 100
exports.getBooksExceedingLimits = async (req, res) => {
  try {
    const books = await Book.find({ borrowFrequency: { $gt: 10 }, availableCopies: { $gt: 100 } });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
