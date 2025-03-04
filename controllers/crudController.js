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

const getSINGLE = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await crudService.getSINGLE(id);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const create = async (req, res) => {
    try {
        const response = await crudService.create(req.body);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const updateSINGLE = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await crudService.updateSINGLE(id, req.body);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const deleteSINGLE = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await crudService.deleteSINGLE(id);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = {
    getALL,
    getSINGLE,
    create,
    updateSINGLE,
    deleteSINGLE,
};
