const mongoose = require("mongoose");

const crudModuleNameSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const crudModuleName = mongoose.model("crudModuleName", crudModuleNameSchema);

module.exports = crudModuleName;
