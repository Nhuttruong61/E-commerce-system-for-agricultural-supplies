const mongose = require("mongoose");

const connectMONGO = () => {
  mongose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connect Db success!");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = connectMONGO;
