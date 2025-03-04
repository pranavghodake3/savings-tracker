const express = require("express");
const router = express.Router();
const crudController = require("../controllers/crudController")

router.get("/", crudController.getALL);
router.get("/:id", crudController.getSINGLE);
router.post("/", crudController.create);
router.put("/:id", crudController.updateSINGLE);
router.delete("/:id", crudController.deleteSINGLE);

module.exports = router;
