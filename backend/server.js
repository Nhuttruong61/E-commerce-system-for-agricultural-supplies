const app = require("./app");
const connectMONGO = require("./db/Database");
const cloudinary = require("cloudinary");
//handling uncaught exceptions

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down server for handling uncaught exception`);
});

//config

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}
// connect mongo
connectMONGO();

//connect cloudinary
cloudinary.config({
  cloud_name: "dnicqkz3v",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create server

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running at on http://localhost: ${process.env.PORT}`);
});

// unhandled promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandled rejection`);

  server.close(() => {
    process.exit(1);
  });
});
