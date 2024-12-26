const mongoose = require("mongoose");

const borrowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  membershipActive: { type: Boolean, required: true },
  membershipType: {
    type: String,
    required: true,
    enum: ["Standard", "Premium"],
  },
  overdueBooks: { type: Number, default: 0 }, // For business logic
});

borrowerSchema.methods.canBorrow = function () {
  const limit = this.membershipType === "Premium" ? 10 : 5;
  return this.membershipActive && this.borrowedBooks.length < limit && this.overdueBooks === 0;
};

module.exports = mongoose.model("Borrower", borrowerSchema);
