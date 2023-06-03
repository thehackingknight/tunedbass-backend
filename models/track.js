const { Schema, model } = require("mongoose");

const TrackSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.String,
        required: true,
    },
    price: {
        type: Schema.Types.Number,
        default: 0
    },
    duration: {
        type: String,
        required: true
    },
    size_in_bytes: {
        type: Number, 
        required: true
    },

    public_id: {
        type: String,
        required: true
    },
    album: String,
    description: String,
    genre: String,
    artwork: {type: String, default: "https://res.cloudinary.com/sketchi/image/upload/v1642950989/TunedBass/images/mp3-download-icon-10_nsmdjt.png"},
    url: {
        type: String,
        required: true 
    },
    likes: [],
    plays: [],
    shares: [],
    tags: [],
    collabos: [],
    is_beat: {
        type: Schema.Types.Boolean,
        default: true
    },
    is_demo: { // Not yet released. Just a sample
        type: Schema.Types.Boolean,
        default: false
    },
    sold: { // Not yet released. Just a sample
        type: Schema.Types.Boolean,
        default: false
    },
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


const Track =model("Track",  TrackSchema )

module.exports = { Track}