const { Schema, model } = require("mongoose");
const { ArtistModel, ArtistSchema } = require("./artist_model");

const TrackSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        required: true
    },
    album: String,
    artwork: String,
    url: {
        type: String,
        required: true 
    },
    likes: [],
    plays: [],
    shares: [],
    date_created: {
        type: Date,
        default: new Date()
    },
    date_modified: {
        type: Date,
        default: new Date()
    },

})
const TrackModel =model("Track",  TrackSchema )

module.exports = { TrackModel}