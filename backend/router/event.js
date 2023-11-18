const express = require("express");
const router = express.Router();
const eventControler = require("../controllers/eventController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
router.post(
  "/create-event",
  isAuthenticated,
  isAdmin("admin"),
  eventControler.createEvent
);
router.get("/get-all-events", eventControler.getAllEvent);
router.get("/get-event/:id", eventControler.getaEvent);
router.delete("/delete-event/:id", isAuthenticated, eventControler.deleteEvent);
module.exports = router;
