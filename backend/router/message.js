const express = require("express");
const router = express.Router();
const MessageController = require("../controller/messageControler");
const { isAuthenticated } = require("../middleware/auth");

router.post(
  "/create-message",
  isAuthenticated,
  MessageController.createMessage
);

router.get(
  "/get-all-message/:id",
  isAuthenticated,
  MessageController.getAllMessage
);
router.put(
  "/update-message/:id",
  isAuthenticated,
  MessageController.updateMessage
);
module.exports = router;
