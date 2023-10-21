const Messages = require("../model/message");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Conversation = require("../model/conversation");
const cloudinary = require("cloudinary");
const createMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const messageData = req.body;
    if (req.body.images) {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
        folder: "messagesImg",
      });
      messageData.images = {
        public_id: myCloud.public_id,
        url: myCloud.url,
      };
    }

    messageData.conversationId = req.body.conversationId;
    messageData.sender = req.body.sender;
    messageData.text = req.body.text;

    const message = new Messages({
      conversationId: messageData.conversationId,
      text: messageData.text,
      sender: messageData.sender,
      images: messageData.images ? messageData.images : undefined,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//get all messages
const getAllMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const messages = await Messages.find({ conversationId: id });
    res.status(200).json({
      success: true,
      message: messages,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//update last message
const updateMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { lastMessage, lastMessageId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
      lastMessage,
      lastMessageId,
    });
    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createMessage,
  updateMessage,
  getAllMessage,
};
