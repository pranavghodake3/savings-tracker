const transactionService = require("../services/transactionService")
const { successResponse, errorResponse } = require("../utils/responseHelper");

const gettransactions = async (req, res) => {
    try {
        const response = await transactionService.gettransactions();
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const gettransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await transactionService.gettransaction(id);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const create = async (req, res) => {
    try {
        console.log("req.body: ",req.body)
        const response = await transactionService.create(req.body);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const updatetransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await transactionService.updatetransaction(id, req.body);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const deletetransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await transactionService.deletetransaction(id);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = {
    gettransactions,
    gettransaction,
    create,
    updatetransaction,
    deletetransaction,
};
