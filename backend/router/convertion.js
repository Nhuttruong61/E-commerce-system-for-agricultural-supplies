const express = require("express");
const router = express.Router();
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const convertionController = require("../controllers/convertionController");

router.post("/create-new-convention", convertionController.createConversation);
router.get(
  "/get-all-convention/:id",
  isAuthenticated,
  isAdmin,
  convertionController.getAllConversations
);
module.exports = router;
