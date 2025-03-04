const transactionModel = require("../models/transactionModel");
const categoryService = require("../services/categoryService");

const gettransactions = async() => {
    const transactions = await transactionModel.find();

    return {
        transactions,
    };
};

const gettransaction = async(id) => {
    const transaction = await transactionModel.findById(id);

    return {
        transaction,
    };
};

const create = async(body) => {
    const { date, categoryId, subCategoryId, newSubCategory, amount } = body;
    let finalSubCategoryId = subCategoryId;
    if (newSubCategory) {
        const newSubCategoryCreated = await categoryService.create({
            name: newSubCategory,
            parent: categoryId
        });
        finalSubCategoryId = newSubCategoryCreated._id;
    }

    const transactionModelObj = new transactionModel({
        date,
        categoryId,
        subCategoryId: finalSubCategoryId,
        amount,
    });
    const data = await transactionModelObj.save();

    return data;
};

const updatetransaction = async(id, body) => {
    const { date, categoryId, subCategoryId, newSubCategory, amount } = body;
    let finalSubCategoryId = subCategoryId;
    if (newSubCategory) {
        const newSubCategoryCreated = await categoryService.create({
            name: newSubCategory,
            parent: categoryId
        });
        finalSubCategoryId = newSubCategoryCreated._id;
    }
    const data = await transactionModel.findByIdAndUpdate(id, {date, categoryId, subCategoryId: finalSubCategoryId, amount});

    return data;
};

const deletetransaction = async(id) => {
    const data = await transactionModel.findByIdAndDelete(id);

    return data;
};

module.exports = {
    gettransactions,
    gettransaction,
    create,
    updatetransaction,
    deletetransaction,
};
