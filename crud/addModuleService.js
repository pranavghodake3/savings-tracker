const fs = require("fs").promises;
const path = require("path");
const rootPath = process.cwd();
const pluralize = require('pluralize');
const { successResponse, errorResponse } = require("../utils/responseHelper");

const addModule = async(req, res) => {
    try {
        const moduleName = req.params.moduleName;
        let readFilePath = path.join(rootPath, 'routes', 'testRoute.js');
        let fileContent = await fs.readFile(readFilePath, 'utf8');
        fileContent = fileContent.replaceAll("test", moduleName);
        let writeFilePath = path.join(rootPath, 'routes',  `${moduleName}.js`);
        await fs.writeFile(writeFilePath, fileContent, 'utf8');

        readFilePath = path.join(rootPath, 'controllers', 'testController.js');
        fileContent = await fs.readFile(readFilePath, 'utf8');
        fileContent = fileContent.replaceAll("test", moduleName);
        writeFilePath = path.join(rootPath, 'controllers',  `${moduleName}Controller.js`);
        await fs.writeFile(writeFilePath, fileContent, 'utf8');

        readFilePath = path.join(rootPath, 'services', 'testService.js');
        fileContent = await fs.readFile(readFilePath, 'utf8');
        fileContent = fileContent.replaceAll("test", moduleName);
        writeFilePath = path.join(rootPath, 'services',  `${moduleName}Service.js`);
        await fs.writeFile(writeFilePath, fileContent, 'utf8');
        return successResponse(res, {success: true});
    } catch (error) {
        return errorResponse(res, error);
    }
};

const addCRUDModule = async(req, res) => {
    try {
        const crudModuleName = req.params.crudModuleName;
        let readFilePath = path.join(rootPath, 'crud', 'crudRoute.js');
        let fileContent = await fs.readFile(readFilePath, 'utf8');
        fileContent = replaceWithCrudModuleName(fileContent, crudModuleName, 'route');
        let writeFilePath = path.join(rootPath, 'routes',  `${crudModuleName}Route.js`);
        await fs.writeFile(writeFilePath, fileContent, 'utf8');

        readFilePath = path.join(rootPath, 'crud', 'crudController.js');
        fileContent = await fs.readFile(readFilePath, 'utf8');
        fileContent = replaceWithCrudModuleName(fileContent, crudModuleName, 'controller');
        writeFilePath = path.join(rootPath, 'controllers',  `${crudModuleName}Controller.js`);
        await fs.writeFile(writeFilePath, fileContent, 'utf8');

        readFilePath = path.join(rootPath, 'crud', 'crudService.js');
        fileContent = await fs.readFile(readFilePath, 'utf8');
        fileContent = replaceWithCrudModuleName(fileContent, crudModuleName, 'service');
        writeFilePath = path.join(rootPath, 'services',  `${crudModuleName}Service.js`);
        await fs.writeFile(writeFilePath, fileContent, 'utf8');

        readFilePath = path.join(rootPath, 'crud', 'crudModel.js');
        fileContent = await fs.readFile(readFilePath, 'utf8');
        fileContent = fileContent.replaceAll("crudModuleName", capitalizeFirstLetter(crudModuleName));
        writeFilePath = path.join(rootPath, 'models',  `${crudModuleName}Model.js`);
        await fs.writeFile(writeFilePath, fileContent, 'utf8');

        return successResponse(res, {success: true});
    } catch (error) {
        return errorResponse(res, error);
    }
};

const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str[0].toLocaleUpperCase() + str.slice(1);
}

const replaceWithCrudModuleName = (content, crudModuleName, path) => {
    let fileContent = content;
    switch (path) {
        case "route":
            fileContent = fileContent.replaceAll("crud", crudModuleName);
            break;
        case "controller":
            fileContent = fileContent.replaceAll("crud", crudModuleName);
            break;
        case "service":
            fileContent = fileContent.replaceAll("crud", crudModuleName);
            break;
    
        default:
            break;
    }
    crudModuleName = capitalizeFirstLetter(crudModuleName);
    fileContent = fileContent.replaceAll("getALL", "get" + pluralize(crudModuleName));
    fileContent = fileContent.replaceAll("createCRUDMODULE", "create" + crudModuleName);
    fileContent = fileContent.replaceAll("getSINGLEById", "get" + crudModuleName + "ById");
    fileContent = fileContent.replaceAll("updateSINGLEById", "update" + crudModuleName + "ById");
    fileContent = fileContent.replaceAll("deleteSINGLEById", "delete" + crudModuleName + "ById");

    return fileContent;
};

module.exports = {
    addModule,
    addCRUDModule,
};
