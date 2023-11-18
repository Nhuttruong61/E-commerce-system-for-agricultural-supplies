const express = require("express");
const router = express.Router();
const categoryControler = require("../controllers/categorycontroller");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post(
  "/create-category",
  isAuthenticated,
  isAdmin("admin"),
  categoryControler.createCategory
);
router.get("/get-all-categories", categoryControler.getallCategories);
router.put(
  "/update-category/:id",
  isAuthenticated,
  isAdmin("admin"),
  categoryControler.updateCategory
);
router.delete(
  "/delete-category/:id",
  isAuthenticated,
  isAdmin("admin"),
  categoryControler.deleteCategory
);

module.exports = router;
