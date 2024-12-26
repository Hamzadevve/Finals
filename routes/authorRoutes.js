const express = require("express");
const {
  addAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorsExceedingLimits,
} = require("../controllers/authorController");

const router = express.Router();

router.post("/", addAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);
router.get("/limits", getAuthorsExceedingLimits);

module.exports = router;
