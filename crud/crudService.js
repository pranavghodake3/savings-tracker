const crudModel = require("../models/crudModel");

const getALL = async() => {
    const data = await crudModel.find();

    return data;
};

const getSINGLEById = async(id) => {
    const data = await crudModel.findById(id);

    return data;
};

const createCRUDMODULE = async(body) => {
    const crudModelObj = new crudModel(body);
    const data = crudModelObj.save();

    return data;
};

const updateSINGLEById = async(id, body) => {
    const data = await crudModel.findByIdAndUpdate(id, body);

    return data;
};

const deleteSINGLEById = async(id) => {
    const data = await crudModel.findByIdAndDelete(id);

    return data;
};

module.exports = {
    getALL,
    getSINGLEById,
    createCRUDMODULE,
    updateSINGLEById,
    deleteSINGLEById,
};
