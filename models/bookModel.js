const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, required: true },
    changeFrequency: { type: String, required: true },
    hint: { type: String, required: true },
    password: { type: Boolean, required: true },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
