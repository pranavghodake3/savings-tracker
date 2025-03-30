const crudService = require("../services/crudService")
const { successResponse, errorResponse } = require("../utils/responseHelper");

const getALL = async (req, res) => {
    try {
        const response = await crudService.getALL();
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const getSINGLEById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await crudService.getSINGLEById(id);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const createCRUDMODULE = async (req, res) => {
    try {
        const response = await crudService.createCRUDMODULE(req.body);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const updateSINGLEById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await crudService.updateSINGLEById(id, req.body);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const deleteSINGLEById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await crudService.deleteSINGLEById(id);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = {
    getALL,
    getSINGLEById,
    createCRUDMODULE,
    updateSINGLEById,
    deleteSINGLEById,
};
