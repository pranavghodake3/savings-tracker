const express = require("express");
const app = express();
const categoryRoute = require("./routes/category");
const homeRoute = require("./routes/homeRoute");
const transactionRoute = require("./routes/transaction");
const { addModule, addCRUDModule } = require("./services/addModuleService");
const connectDB = require("./config/db");
require("dotenv").config();
connectDB();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/node_modules', express.static('node_modules'));
app.use(express.static('public'));

app.get('/', homeRoute);
app.use("/categories", categoryRoute);
app.use("/transactions", transactionRoute);
app.get("/add-module/:moduleName", addModule);
app.get("/add-crud-module/:crudModuleName", addCRUDModule);

app.listen(process.env.PORT, () => {
    console.log("Server started on PORT: ", process.env.PORT)
});
