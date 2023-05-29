const cloudinary = require("cloudinary").v2;

const nodemailer = require("nodemailer")
const checkAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()) return next()
    else res.status(401).json({msg:"AUTHENTICATION FAILED!"})
  }

  const genUID = ()=>{
    return Date.now() + "-" + Math.round(Math.random() * 1e9);
  }

   const sendMail = async(subject, body, clients) => { 
    try {
  
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",      //"smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL,//testAccount.user, // generated ethereal user
          pass: process.env.PASSWORD//testAccount.pass, // generated ethereal password
        },
      });
  
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"${process.env.SITE_NAME}" <${process.env.EMAIL}>`, // sender address
        to: `"${clients}"`, // list of receivers
        subject, // Subject line
        html: `<html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style type="text/css"> .TunedStreamz {
              font: medium/ 1.5 Arial, Helvetica, sans-serif !important;
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
              color: rgba(0, 0, 0, 0.6);
              font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
              margin: 0 0.25em 0 0;
              padding: 10px 16px;
              text-transform: none;
              text-shadow: none;
              font-weight: 600;
              line-height: 1em;
              font-style: normal;
              text-align: center;
              text-decoration: none;
              border-radius: 0.28571429rem;
              box-shadow: inset 0 0 0 1px transparent,
                inset 0 0 0 0 rgba(34, 36, 38, 0.15);
              -webkit-user-select: none;
              -ms-user-select: none;
              user-select: none;
              transition: opacity 0.1s ease, background-color 0.1s ease,
                color 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
              will-change: "";
              -webkit-tap-highlight-color: transparent;
            }
            .btn-primary {
              color: #fff !important;
              background-color: #0d6efd !important;
              border-color: #0d6efd !important;
            }
            .btn-danger {
              color: #fff !important;
              background-color: #fd950d !important;
              border-color: #fd950d !important;
            }
      
            table {
             
             
              width: 100%;
              
              border-radius: 10px !important;
              padding: 5px;
              border-collapse: collapse;
            }
      
            td,
            th {
              border: 2px solid #8f8f8f;
              text-align: left;
              padding: 8px;
            }
      
            tr:nth-child(even) {
              background-color: #dddddd;
            }
            </style>
        </head>
        <body>

            <div class="TunedStreamz">
            ${body}
            <p>For support please contact us at <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a></p>
            </div>

        </body>
        </html>
              `, // html body
      });
  
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      return "Ok"
    } catch (err) {
      console.log(err);
      return null
    }
   }
   function configCloudinary() {
    // Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  const requestErr = (msg = "Something went wrong!") => {
    return { msg }
  }
module.exports = {requestErr, checkAuthenticated, genUID, sendMail, configCloudinary }