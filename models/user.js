
const { Schema, model, default: mongoose, MongooseError } = require("mongoose");
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
    },
    auth_token: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        
    },
    artwork: String,
    is_verified: {
        type: Boolean,
        default: false
    },
    tracks:{
        type: [Schema.Types.String],
    
    },
    account_type: {
        type: String,
        default: "normal"
    },
    orders: [],
    date_created: {
        type: Date,
        default: new Date()
    },
    date_modified: {
        type: Date,
        default: new Date()
    },

})
const User = model("User", UserSchema )
module.exports = { User} 