const Category = require("../models/categoryModel");
const transactionModel = require("../models/transactionModel");
const categoryService = require("../services/categoryService");

const gettransactions = async() => {
    const transactions = await transactionModel.find().sort({date: -1});

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
    const { date, categoryId, categoryName, categorySlug, newSubCategory, primarySubCategoryId, secondarySubCategoryId, amount } = body;
    // let finalSubCategoryId = subCategoryId;
    let transactionModelObj;
    let data;
    if(categoryName == 'Savings'){
        const transactionModelObj = new transactionModel({
            date,
            categoryId,
            subCategoryId: primarySubCategoryId,
            amount,
        });
        const data = await transactionModelObj.save();
    }else if(categoryName == 'Lent'){
        const withdrawCategory =  await Category.findOne({name: 'Withdraw'});
        transactionModelObj = new transactionModel({
            date,
            categoryId: withdrawCategory._id,
            subCategoryId: secondarySubCategoryId,
            amount,
        });
        data = await transactionModelObj.save();
        transactionModelObj = new transactionModel({
            date,
            categoryId,
            subCategoryId: primarySubCategoryId,
            amount,
        });
        data = await transactionModelObj.save();
    }else if(categoryName == 'Lent Received'){
        const savingsCategory =  await Category.findOne({name: 'Savings'});
        transactionModelObj = new transactionModel({
            date,
            categoryId,
            subCategoryId: primarySubCategoryId,
            amount,
        });
        data = await transactionModelObj.save();
        transactionModelObj = new transactionModel({
            date,
            categoryId: savingsCategory._id,
            subCategoryId: secondarySubCategoryId,
            amount,
        });
        data = await transactionModelObj.save();
    }
    // if (newSubCategory) {
    //     const newSubCategoryCreated = await categoryService.create({
    //         name: newSubCategory,
    //         main: false,
    //         slug: categorySlug,
    //     });
    //     finalSubCategoryId = newSubCategoryCreated._id;
    // }

    // const transactionModelObj = new transactionModel({
    //     date,
    //     categoryId,
    //     subCategoryId: finalSubCategoryId,
    //     amount,
    // });
    // const data = await transactionModelObj.save();

    return data;
};

const updatetransaction = async(id, body) => {
    const { date, categoryId, subCategoryId, newSubCategory, amount, mainCategorySlug } = body;
    let finalSubCategoryId = subCategoryId;
    if (newSubCategory) {
        const newSubCategoryCreated = await categoryService.create({
            name: newSubCategory,
            main: false,
            slug: mainCategorySlug,
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
