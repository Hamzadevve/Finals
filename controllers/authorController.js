const Author = require("../models/Author");
const Book = require("../models/Book");

// Add a new author
exports.addAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Update an author
exports.updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.status(200).json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get authors linked to more than 5 books
exports.getAuthorsExceedingLimits = async (req, res) => {
  try {
    const authors = await Author.aggregate([
      { $lookup: { from: "books", localField: "_id", foreignField: "author", as: "books" } },
      { $project: { name: 1, booksCount: { $size: "$books" } } },
      { $match: { booksCount: { $gt: 5 } } },
    ]);

    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};