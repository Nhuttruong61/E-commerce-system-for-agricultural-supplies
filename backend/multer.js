const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "upload/");
  },
  filename: function (req, res, cb) {
    const uniqeSuffix =
      Date.now() + "-" + Math.round.apply(Math.random() * 1e9);
      const filename = file.originnalname.split(".")[0];
      cb(null, filename + "-" + uniqeSuffix + ".png");
  },
});

exports.upload = multer({storage: storage})
