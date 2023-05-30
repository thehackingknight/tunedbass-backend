const router = require("express").Router();
const multer = require("multer");
const https = require("https");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const { configCloudinary } = require("../../utils/functions");
const { TrackModel } = require("../../models/track_model")
let url = "";
let html = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">


            .TunedStreamz{
                font: medium/ 1.5  Arial,Helvetica,sans-serif !important;
                margin: auto;
                padding: 10px;
                color: black;

            }





            .btn {
                cursor: pointer;
                display: inline-block;
                min-height: 1em;
                outline: 0;
                border: none;
                vertical-align: baseline;
                background: #e0e1e2 none;
                color: rgba(0,0,0,.6);
                font-family: Lato,"Helvetica Neue",Arial,Helvetica,sans-serif;
                margin: 0 .25em 0 0;
                padding: 10px 16px;
                text-transform: none;
                text-shadow: none;
                font-weight: 600;
                line-height: 1em;
                font-style: normal;
                text-align: center;
                text-decoration: none;
                border-radius: .28571429rem;
                box-shadow: inset 0 0 0 1px transparent,inset 0 0 0 0 rgba(34,36,38,.15);
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
                transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease;
                will-change: "";
                -webkit-tap-highlight-color: transparent;
            }
            .btn-primary {
                color: #fff !important;
                background-color: #0d6efd !important;
                border-color: #0d6efd !important;

            }
    </style>
</head>
<body>

    <div class="TunedStreamz">

    <h1>Your order has been processed successfully!</h1>
       
    <p>Here is your unique download url:</p>
    <a class="btn " href=${url} >Download</a>
    
    <p>For support please contact us at <a href="mailto:tunedbass@gmail.com">tunedbass@gmail.com</a></p>
    </div>

</body>
</html>`;
router.get("/:token", async (req, res) => {
  let ids = ["TunedBass/Tonics/raw/audio/TB_My Land-by-Tonics-1685388801482-300948573"];
  let { token } = req.params;

  configCloudinary();
  try {
    let jwtInfo = require("jsonwebtoken").verify(token, process.env.SECRET_KEY, { algorithms: ["HS256"]})
    const { trackId} = jwtInfo
    //return res.send("Pls wait")
    let track = await TrackModel.findById(trackId).exec()

    if (track){
      let url = track.url;
      let { range } = req.headers;
    if (true) {
      range = range ? range : "bytes=0-"
      // @ts-ignore
      let total = 1384559//Math.floor((1024*1024) * 12.2)
      
      const parts = range.replace(/bytes=/, '').split('-');
      const partialStart = parts[0];
      const partialEnd = parts[1];
      const start = parseInt(partialStart, 10);
      const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
      const chunksize = (end - start) + 1;
      // Create headers
      const headers = {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,                                   //"Content-Range": `bytes ${start}-${end}/${total}`,
                         'Accept-Ranges': 'bytes', 'Content-Length': chunksize,                                   //"Accept-Ranges": "bytes",
                         'Content-Type': 'audio/mpeg' ,
                         'Content-disposition': `attachment; filename=TunedBass_-_${track.title}.mp3`                          //"Content-Length": contentLength,
      };
      //res.setHeader('Content-disposition', 'attachment; filename=My Land.mp3')
      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);
      //rstream.pipe(res)
      // @ts-ignore
      https.get(url, (stream) => {
        stream.pipe(res);
        stream.on("end", (_) =>{

          res.end()
        });
      });
    }
    else{
      console.log("No range");
      res.status(400).send("Provide range")
    }
    }
   /*  let r = cloudinary.utils.download_zip_url({
      public_ids: ids,
      resource_type: "raw",
      mode: "download",
    }); */
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
module.exports = router;
//"fb2b1527c8f0766a3003ed8801d38790.mp3"
