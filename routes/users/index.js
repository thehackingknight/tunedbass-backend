const router = require('express').Router()
const { ArtistModel } = require('../../models/artist_model')
const { TrackModel } = require('../../models/track_model')

router.get("/", (req, res) =>{
    ArtistModel.find().then(_res=>{
        res.json({"users": _res})
    })
})

router.post('/delete', async (req, res)=>{
    const {username} = req.body
    ArtistModel.findOneAndRemove({ username }).then(user =>{
        if (user){
            // Delete tracks uploaded by this user
            user.tracks.forEach(it=>{
                TrackModel.findByIdAndRemove(it).then(r=>{
                    if (r) console.log("Removed Track: " + r.title);
                })
            })
      
            res.status(200).send(user.username + " deleted!")}
        else res.status(400).send("User not found")
    })
})


module.exports = router