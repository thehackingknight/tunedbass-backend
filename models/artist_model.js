const { Schema, model } = require("mongoose");
const ArtistSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    artwork: String,
  
    tracks:{
        type: [Schema.Types.ObjectId],
        ref: "Track"
    },
    date_created: {
        type: Date,
        default: new Date()
    },
    date_modified: {
        type: Date,
        default: new Date()
    },

})
const ArtistModel = model("Artist", ArtistSchema )
module.exports = { ArtistModel }