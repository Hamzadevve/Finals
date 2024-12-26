const express = require("express");
const {
  addBook,
  updateBook,
  deleteBook,
  getBooksExceedingLimits,
} = require("../controllers/bookController");

const router = express.Router();

router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.get("/limits", getBooksExceedingLimits);

module.exports = router;
