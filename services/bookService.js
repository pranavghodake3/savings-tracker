const bookModel = require("../models/bookModel");

const getbooks = async() => {
    const data = await bookModel.find();

    return data;
};

const getbook = async(id) => {
    const data = await bookModel.findById(id);

    return data;
};

const create = async(body) => {
    const bookModelObj = new bookModel(body);
    const data = bookModelObj.save();

    return data;
};

const updatebook = async(id, body) => {
    const data = await bookModel.findByIdAndUpdate(id, body);

    return data;
};

const deletebook = async(id) => {
    const data = await bookModel.findByIdAndDelete(id);

    return data;
};

module.exports = {
    getbooks,
    getbook,
    create,
    updatebook,
    deletebook,
};
