const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.mongoUrl).then(()=>{console.log("connected to db")}).catch((err)=>{console.log(err)})

const AvailSchema = new mongoose.Schema({
    normal_avail: {type: Array, default: []},
    deluxe_avail: {type: Array, default: []},
    premium_avail: {type: Array, default: []}
},
    {timestamps: true}
)

module.exports = new mongoose.model("AvailableRooms", AvailSchema)