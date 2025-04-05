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
    const { date, categoryId, categoryName, categorySlug, new_sub_category_check, newSubCategory, primarySubCategoryId, secondarySubCategoryId, amount } = body;
    let finalSubCategoryId = primarySubCategoryId;
    let transactionModelObj;
    let data = [];
    let transaction;
    if (typeof new_sub_category_check != 'undefined' && newSubCategory) {
        const existingSubCategory = await Category.findOne({name: newSubCategory});
        if(!existingSubCategory){
            const newSubCategoryCreated = await categoryService.create({
                name: newSubCategory,
                main: false,
                slug: categorySlug,
            });
            finalSubCategoryId = newSubCategoryCreated._id;
        }else{
            finalSubCategoryId = existingSubCategory._id;
        }
    }

    if(categoryName == 'Savings'){
        const transactionModelObj = new transactionModel({
            date,
            categoryId,
            subCategoryId: finalSubCategoryId,
            amount,
        });
        transaction = await transactionModelObj.save();
        data.push(transaction);
    }else if(categoryName == 'Lent'){
        const withdrawCategory =  await Category.findOne({name: 'Withdraw'});
        transactionModelObj = new transactionModel({
            date,
            categoryId: withdrawCategory._id,
            subCategoryId: secondarySubCategoryId,
            amount,
        });
        transaction = await transactionModelObj.save();
        data.push(transaction);
        transactionModelObj = new transactionModel({
            date,
            categoryId,
            subCategoryId: finalSubCategoryId,
            amount,
        });
        transaction = await transactionModelObj.save();
        data.push(transaction);
    }else if(categoryName == 'Lent Received'){
        const savingsCategory =  await Category.findOne({name: 'Savings'});
        transactionModelObj = new transactionModel({
            date,
            categoryId,
            subCategoryId: finalSubCategoryId,
            amount,
        });
        transaction = await transactionModelObj.save();
        data.push(transaction);
        transactionModelObj = new transactionModel({
            date,
            categoryId: savingsCategory._id,
            subCategoryId: secondarySubCategoryId,
            amount,
        });
        transaction = await transactionModelObj.save();
        data.push(transaction);
    }

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
