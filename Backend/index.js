const express = require("express");
const homeRoute = require("./routes/home")

const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/home", homeRoute)

mongoose.connect(process.env.mongoUrl).then(()=>{console.log("Connected to db")}).catch((err)=>{console.log(err)})

app.listen(process.env.port, () => {
    console.log("It Works")
})