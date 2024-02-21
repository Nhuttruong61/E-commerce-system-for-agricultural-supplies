const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const BlogControler = require("../controllers/blogController");

router.post("/create-blog", isAuthenticated, isAdmin, BlogControler.createBlog);
router.get("/get-all-blog", BlogControler.getAllBlog);
router.get("/get-a-blog/:id", BlogControler.getAblog);
router.put(
  "/update-blog/:id",
  isAuthenticated,
  isAdmin,
  BlogControler.updateBlog
);
router.delete(
  "/delete-blog/:id",
  isAuthenticated,
  isAdmin,
  BlogControler.deleteBlog
);

module.exports = router;
