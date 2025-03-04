const { errorResponse } = require("../utils/responseHelper");

const getMasterPassword = async () => {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${MASTER_SHEET}!A:A`,
    });

    return response.data.values.map(e=> e[0])[0];
};

const homeFirstFunction = async (req, res) => {
    try {
        return res.render('index');
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = {
    homeFirstFunction,
};
