const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

router.post("/", verifyToken, requireRole([1, 3]), controller.createProduct);
router.get("/", verifyToken, requireRole([1, 2, 3]), controller.getProducts);
router.get("/:id", verifyToken, requireRole([1, 2, 3]), controller.getProductById);
router.put("/:id", verifyToken, requireRole([1, 3]), controller.updateProduct);
router.delete("/:id", verifyToken, requireRole([1, 3]), controller.deleteProduct);


module.exports = router;
