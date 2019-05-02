const express = require("express");
const connectDB = require("./config/db");

const app = express();

// connect DB
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Api running."));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profiles", require("./routes/api/profiles"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/recipes", require("./routes/api/recipes"));

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`App running on port ${port}`));
