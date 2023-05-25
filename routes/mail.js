const router = require("express").Router();
const nodemailer = require("nodemailer");
const { sendMail } = require("../utils/functions");

router.post("/send", async (req, res) => {
  try {
    let r = await sendMail("Test email", "<h5>Just tesing</h5>", "squashdavenport2@gmail.com")
    if (r) res.send("OK");
    else res.status(500).send("Could not send email");
  } catch (err) {
    console.log(err);
    res.status(500).send("Inernal server error");
  }
});
module.exports = router;
