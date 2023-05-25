
const { Schema, model, default: mongoose, MongooseError } = require("mongoose");
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
        required: true,
        
    },
    artwork: String,
  
    tracks:{
        type: [Schema.Types.String],
    
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
module.exports = { ArtistModel} 