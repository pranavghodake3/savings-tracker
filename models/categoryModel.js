const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    main: { type: Boolean, required: true },
    slug: { type: String, required: true },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
