const mongoose = require("mongoose");
const { isEmail } = require("../utils/validations");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Invalid email format"],
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validates 10-digit phone numbers
      },
      message: "Invalid phone number",
    },
  },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

authorSchema.pre("save", function (next) {
  if (this.books.length > 5) {
    return next(new Error("An author cannot be linked to more than 5 books"));
  }
  next();
});

module.exports = mongoose.model("Author", authorSchema);
