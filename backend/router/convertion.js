const express = require("express");
const router = express.Router();
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const convertionController = require("../controller/convertionControler");

router.post("/create-new-convention", convertionController.createConversation);
router.get(
  "/get-all-convention/:id",
  isAuthenticated,
  isAdmin("admin"),
  convertionController.getAllConversations
);
module.exports = router;
