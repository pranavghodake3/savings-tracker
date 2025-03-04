const bookService = require("../services/bookService")
const { successResponse, errorResponse } = require("../utils/responseHelper");

const getbooks = async (req, res) => {
    try {
        const response = await bookService.getbooks();
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const getbook = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await bookService.getbook(id);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const create = async (req, res) => {
    try {
        const response = await bookService.create(req.body);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const updatebook = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await bookService.updatebook(id, req.body);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const deletebook = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await bookService.deletebook(id);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = {
    getbooks,
    getbook,
    create,
    updatebook,
    deletebook,
};
