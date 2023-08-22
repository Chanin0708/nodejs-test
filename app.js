require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const loginRouter = require("./routes/auth/login");
const registerRouter = require("./routes/auth/register");

const app = express();

app.use(express.json());

app.use("/login", loginRouter);
app.use("/auth/register", registerRouter);

module.exports = app;
