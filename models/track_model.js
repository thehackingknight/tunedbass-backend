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
        required: true,
    },
    duration: {
        type: String,
        required: true
    },
    album: String,
    artwork: {type: String, default: "https://res.cloudinary.com/sketchi/image/upload/v1642950989/TunedBass/images/mp3-download-icon-10_nsmdjt.png"},
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
    release_date: {
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