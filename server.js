const express = require("express");
const connectDB = require("./config/db");

const app = express();

// connect DB
connectDB();

app.get("/", (req, res) => res.send("Api running."));

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`App running on port ${port}`));
