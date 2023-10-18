const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const BlogControler = require("../controller/blogControler");

router.post(
  "/create-blog",
  isAuthenticated,
  isAdmin("admin"),
  BlogControler.createBlog
);
router.get("/get-all-blog", BlogControler.getAllBlog);

module.exports = router;
