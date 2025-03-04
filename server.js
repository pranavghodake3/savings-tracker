const express = require("express");
const app = express();
const testRoute = require("./routes/testRoute");
const { addModule, addCRUDModule } = require("./services/addModuleService");
require("dotenv").config();

app.use("/test", testRoute);
app.get("/add-module/:moduleName", addModule);
app.get("/add-crud-module/:crudModuleName", addCRUDModule);

app.listen(process.env.PORT, () => {
    console.log("Server started on PORT: ", process.env.PORT)
});
