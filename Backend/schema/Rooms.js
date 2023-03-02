const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    number: {type: String, required: true, unique: true},
    roomType: {type: String, required: true},
    price: {type: Number, required: true},
},
    {timestamps: true}
)

module.exports = new mongoose.model("Room", RoomSchema);