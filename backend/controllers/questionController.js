const Question = require("../model/question");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/user");
const cloudinary = require("cloudinary");
//create question
const createQuestion = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, content, images } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete question information.",
      });
    }

    const userId = await User.findById(req.user._id);
    let question;

    if (images.length > 0) {
      const myCloud = await cloudinary.v2.uploader.upload(images, {
        folder: "imgQuestion",
      });
      question = await Question.create({
        title,
        content,
        author: userId,
        images: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
    } else {
      question = await Question.create({
        title,
        content,
        author: userId,
      });
    }

    res.status(201).json({
      success: true,
      question,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//confirm question admin
const confirmQuestionAdmin = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    const { status } = req.body;
    if (!question) {
      return next(new ErrorHandler("question not found ", 400));
    }
    question.status = status;
    await question.save();
    res.status(201).json({
      success: true,
      question,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// get all questions
const getAllQuestions = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.find();
    res.status(201).json({
      success: true,
      question,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
// get a question
const getaQuestion = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return next(new ErrorHandler("Question not found", 400));
    }
    res.status(201).json({
      success: true,
      question,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//edit question by user
const editQuestionUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    const { title, content, images } = req.body;
    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }
    if (question.author._id.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler(
          "You do not have permission to edit this question",
          403
        )
      );
    }
    if (images.length > 0) {
      let isCloudinaryImage = await images?.includes("cloudinary");
      if (images && !isCloudinaryImage && question?.images.length > 0) {
        await cloudinary.v2.uploader.destroy(question.images[0].public_id);
        const myCloud = await cloudinary.v2.uploader.upload(images, {
          folder: "imgQuestion",
        });
        question.images = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else if (images && question?.images.length === 0) {
        const myCloud = await cloudinary.v2.uploader.upload(images, {
          folder: "imgQuestion",
        });
        question.images = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }
    question.title = title;
    question.content = content;
    await question.save();
    res.status(200).json({
      success: true,
      message: "Question has been edited successfully",
      question,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//delete question by user
const deleteQuestionUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }
    if (question.author._id.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler(
          "You do not have permission to edit this question",
          403
        )
      );
    }
    if (question.images.length > 0) {
      await cloudinary.v2.uploader.destroy(question.images.public_id);
    }
    await Question.findByIdAndDelete(question);
    res.status(200).json({
      success: true,
      message: "Question has been edited successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// delete by admin
const deleteQuestionAdmin = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return next(new ErrorHandler("Question not found", 400));
    }
    await Question.findByIdAndDelete(question);
    res.status(201).json({
      success: true,
      message: "Question delete successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// create comment
const createComment = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }
    const { content } = req.body;
    if (!content) {
      return next(new ErrorHandler("Please provide comment content", 400));
    }
    const comment = {
      content,
      author: req.user,
    };
    question.comments.push(comment);
    await question.save();
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// get a comment
const getComment = catchAsyncErrors(async (req, res, next) => {
  try {
    const { questionId, commentId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }
    const comment = await question.comments.id(commentId);
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// edit comment
const editComment = catchAsyncErrors(async (req, res, next) => {
  try {
    const { questionId, commentId } = req.params;

    const { content } = req.body;
    const question = await Question.findById(questionId);
    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }
    const comment = await question.comments.id(commentId);
    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404));
    }
    if (comment.author._id.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler("You do not have permission to edit this comment", 403)
      );
    }
    comment.content = content;
    await question.save();
    res.status(200).json({
      success: true,
      message: "Comment edited successfully",
      comment,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//delete comment
const deleteComment = catchAsyncErrors(async (req, res, next) => {
  try {
    const { questionId, commentId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }
    const comments = question.comments.toObject();
    const comment = comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404));
    }
    // if (comment.author._id.toString() !== req.user._id.toString()) {
    //   return next(
    //     new ErrorHandler("You do not have permission to edit this comment", 403)
    //   );
    // }
    const index = comments.indexOf(comment);
    if (index > -1) {
      comments.splice(index, 1);
    }
    question.comments = comments;
    await question.save();

    res.status(200).json({
      success: true,
      message: "Comment has been deleted successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const updateView = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }
    question.view += 1;
    await question.save();

    res.status(200).json({
      success: true,
      question,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
const reportComment = catchAsyncErrors(async (req, res, next) => {
  const { questionId, commentId } = req.params;
  const { userid } = req.body;
  try {
    const updatedQuestion = await Question.findOneAndUpdate(
      {
        _id: questionId,
        "comments._id": commentId,
      },
      {
        $inc: { "comments.$.report": 1 },
        $addToSet: { "comments.$.userReport": userid },
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return next(new ErrorHandler("Question or Comment not found", 404));
    }
    const updatedComment = updatedQuestion.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!updatedComment) {
      return next(new ErrorHandler("Comment not found", 404));
    }

    res.status(200).json({
      success: true,
      comment: updatedComment,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createQuestion,
  confirmQuestionAdmin,
  editQuestionUser,
  deleteQuestionUser,
  deleteQuestionAdmin,
  getAllQuestions,
  getaQuestion,
  createComment,
  getComment,
  editComment,
  deleteComment,
  updateView,
  reportComment,
};
