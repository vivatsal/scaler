const mongoose = require("mongoose")

const ReserveSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    number: {type: String},
    roomType: {type: String, required: true},
    status: {type: Number, required: true},
    roomPrice: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    duration: {type: Number, required: true},
    startDateTime: {type: Date, required: true},
    bookingTime: {type: Date, required: true},
    endDateTime: {type: Date},
    tip: {type: Number, default: 0},
    waiter: {type: String, default: ""}
})

module.exports = new mongoose.model("ReserveRoom", ReserveSchema);