const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController")

router.get("/", bookController.getbooks);
router.get("/:id", bookController.getbook);
router.post("/", bookController.create);
router.put("/:id", bookController.updatebook);
router.delete("/:id", bookController.deletebook);

module.exports = router;
