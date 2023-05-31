const { Schema, model } = require("mongoose");

const CarSchema = new Schema({
    name: String,
    speed: Number
})
const OTP_Schema = new Schema({
    otp: {type: Number, required: true, unique: true},
    user: {type: String, required: true},
    date_created: {
        type: Number,
        default: Date.now()
    }
})

const CarModel =model("car",  CarSchema )
const OTP_Model =model("otp",  OTP_Schema )
module.exports = { CarModel, OTP_Model }