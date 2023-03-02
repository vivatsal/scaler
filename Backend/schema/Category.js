const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    normal: {type: Number, default: 0},
    deluxe: {type: Number, default: 0},
    premium: {type: Number, default: 0} 
},
    {timestamps: true}
)

module.exports = new mongoose.model("Category", CategorySchema)