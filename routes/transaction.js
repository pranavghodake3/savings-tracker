const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController")

router.get("/", transactionController.gettransactions);
router.get("/:id", transactionController.gettransaction);
router.post("/", transactionController.create);
router.put("/:id", transactionController.updatetransaction);
router.delete("/:id", transactionController.deletetransaction);

module.exports = router;
