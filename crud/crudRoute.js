const express = require("express");
const router = express.Router();
const crudController = require("../controllers/crudController")

router.get("/", crudController.getALL);
router.get("/:id", crudController.getSINGLEById);
router.post("/", crudController.createCRUDMODULE);
router.put("/:id", crudController.updateSINGLEById);
router.delete("/:id", crudController.deleteSINGLEById);

module.exports = router;
