const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    categoryId: { type: String, required: true },
    subCategoryId: { type: String, required: true },
    amount: { type: Number, required: true },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
