require("dotenv").config();

const express = require("express");
const app = express();


const searchRouter = require("./routes/search");

app.use('/search', searchRouter)

app.listen(process.env.PORT, () => console.log("Server started on port:", process.env.PORT));
