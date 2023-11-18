const Conversation = require("../model/conversation");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

//create new Conversation

const createConversation = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId, AdminId, groupTitle } = req.body;
    const isConversationExist = await Conversation.findOne({ groupTitle });

    if (isConversationExist) {
      const conversation = isConversationExist;
      res.status(201).json({
        success: true,
        conversation,
      });
    } else {
      const conversation = await Conversation.create({
        members: [userId, AdminId],
        groupTitle: groupTitle,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
// get all conversations

const getAllConversations = catchAsyncErrors(async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.id],
      },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(201).json({
      success: true,
      conversations,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createConversation,
  getAllConversations,
};
