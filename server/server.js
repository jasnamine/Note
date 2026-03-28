require("dotenv").config();
require("./src/config/connectRedis.js");
const cookieParser = require("cookie-parser");
const express = require("express");
const { sendReminderJob } = require("../server/src/ultities/jobs.js");

const configCors = require("./src/config/cors.js");

const connection = require("./src/config/connectDB.js");
const initRoutes = require("./src/routes");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 8080;

//config cors
configCors(app);

//connect db
connection();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./passport.js");

// Middleware
app.use(passport.initialize());

//init web routes
initRoutes(app);
sendReminderJob();

//req => middleware => res
app.use((req, res) => {
  return res.send("404 not found");
});

app.listen(PORT, () => {
  console.log(">>> Backend is running on the port = " + PORT);
});
