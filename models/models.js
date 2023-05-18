const { Schema, model } = require("mongoose");

const CarSchema = new Schema({
    name: String,
    speed: Number
})

const CarModel =model("car",  CarSchema )
module.exports = { CarModel }