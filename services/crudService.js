const crudModel = require("../models/crudModel");

const getALL = async() => {
    const data = await crudModel.find();

    return data;
};

const getSINGLE = async(id) => {
    const data = await crudModel.findById(id);

    return data;
};

const create = async(body) => {
    const crudModelObj = new crudModel(body);
    const data = crudModelObj.save();

    return data;
};

const updateSINGLE = async(id, body) => {
    const data = await crudModel.findByIdAndUpdate(id, body);

    return data;
};

const deleteSINGLE = async(id) => {
    const data = await crudModel.findByIdAndDelete(id);

    return data;
};

module.exports = {
    getALL,
    getSINGLE,
    create,
    updateSINGLE,
    deleteSINGLE,
};
