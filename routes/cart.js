const multer = require("multer");
const { TrackModel } = require("../models/track_model");
const { ArtistModel } = require("../models/artist_model");
const { requestErr } = require("../utils/functions");

const router = require("express").Router()

router.post("/", multer().none(), async ( req, res ) =>{
    let { cart } = req.body

    try {if (cart) {
        cart = JSON.parse(cart)
        let data = []

        for (let id of cart.items){
            let item = await TrackModel.findById(id).exec().catch(er=>{
                console.log(er);
            })

            if (item) {
                let artist = await ArtistModel.findById(item.artist).exec().catch(er=>{
                    console.log(er);
                })
                if (artist){
                    let _item = {...item.toObject(), id: item.id, artist: {...artist.toObject(), id: artist.id}}
                    data.push(_item)
                }
            }
        }
        res.json({ cart: data })
    }
    else {
        res.status(400).json({msg: "Provide cart"})
    }}catch(e){
        console.log(e);
        res.status(500).json(requestErr())
    }
})

module.exports = router