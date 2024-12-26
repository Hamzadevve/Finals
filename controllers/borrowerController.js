const Borrower = require("../models/Borrower");
const Book = require("../models/Book");

// Add a new borrower
exports.addBorrower = async (req, res) => {
  try {
    const { name, membershipActive, membershipType, borrowedBooks } = req.body;

    // Validate membership type
    const limit = membershipType === "Premium" ? 10 : 5;

    if (borrowedBooks && borrowedBooks.length > limit) {
      return res.status(400).json({ error: `Borrowed books exceed limit for ${membershipType} members.` });
    }

    const borrower = new Borrower({ name, membershipActive, membershipType, borrowedBooks: [] });
    await borrower.save();

    res.status(201).json(borrower);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing borrower
exports.updateBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);

    if (!borrower) {
      return res.status(404).json({ error: "Borrower not found" });
    }

    const { membershipType, borrowedBooks } = req.body;

    if (borrowedBooks) {
      const limit = membershipType === "Premium" ? 10 : 5;

      if (borrowedBooks.length > limit) {
        return res.status(400).json({ error: `Borrowed books exceed limit for ${membershipType} members.` });
      }
    }

    Object.assign(borrower, req.body);
    await borrower.save();

    res.status(200).json(borrower);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Borrow a book
exports.borrowBook = async (req, res) => {
  const { borrowerId, bookId } = req.body;

  try {
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!borrower) {
      return res.status(404).json({ error: "Borrower not found" });
    }

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Prevent borrowing if membership is inactive
    if (!borrower.membershipActive) {
      return res.status(400).json({ error: "Borrower's membership is inactive" });
    }

    // Check membership type borrowing limit
    const limit = borrower.membershipType === "Premium" ? 10 : 5;
    if (borrower.borrowedBooks.length >= limit) {
      return res.status(400).json({ error: "Borrowing limit reached" });
    }

    // Check available copies
    if (book.availableCopies === 0) {
      return res.status(400).json({ error: "No available copies of the book" });
    }

    // Borrow the book
    book.availableCopies -= 1;
    book.borrowFrequency += 1;
    borrower.borrowedBooks.push(bookId);

    await book.save();
    await borrower.save();

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  const { borrowerId, bookId } = req.body;

  try {
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!borrower || !book) {
      return res.status(404).json({ error: "Borrower or Book not found" });
    }

    const index = borrower.borrowedBooks.indexOf(bookId);
    if (index === -1) {
      return res.status(400).json({ error: "This book was not borrowed by the borrower" });
    }

    borrower.borrowedBooks.splice(index, 1);
    book.availableCopies += 1;

    await borrower.save();
    await book.save();

    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
