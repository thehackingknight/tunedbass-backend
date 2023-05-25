const Order = require("../models/order");
const { TrackModel } = require("../models/track_model");
const { requestErr, configCloudinary, sendMail } = require("../utils/functions");
const cloudinary = require("cloudinary").v2;
const router = require("express").Router();

router.get("/", async (req, res) => {
  const { orderId } = req.query;

  if (orderId) {
    try {
      let order = await Order.findById(orderId).exec();
      res.json({ order: order.toJSON() });
    } catch (err) {
      console.log(err);
      res
        .status(404)
        .json(requestErr("Could not find order with ID: " + orderId));
    }
  } else {
    try {
      let orders = await Order.find().exec();
      res.json({ orders: orders.toJSON() });
    } catch (e) {
      console.log(e);
      res.status(500).json(requestErr());
    }
  }
});
const genDownloadUrl = async (ids) => { 
    configCloudinary()
    let r = cloudinary.utils.download_zip_url({
        public_ids: ids,
        resource_type: "video",
        mode: "download",
      });
      return r
 }
router.post("/complete", async (req, res) => {
  let { order_id, details } = req.body;

  try {
    // Find the order by provided order_id
    let order = await Order.findById(order_id).exec();
    order.paypal_details = JSON.parse(details);
    order.last_modified = new Date();
    order.save();
  
    let orderTotal = `$${order.total.toFixed(2)}`
    let paypalOrderId = order.paypal_details.id
    let status = order.paypal_details.status
    let tunedbassOrderId = order.id

    let ids = order.items.map(it => it.public_id)
    
    let downloadUrl = await genDownloadUrl(ids)
    let refreshUrl = process.env.ORIGIN + "order/refresh-download?orderId=" + tunedbassOrderId
    let mailBody = `<div>
    <h1>Your order has been processed successfully!</h1>

    <h3>Order summary:</h3>
    <div>
      <table>
        <thead>
          <tr>
            <th>KEYS</th>
            <th>VALUES</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Total</b></td>
            <td>${orderTotal}</td>
          </tr>
          <tr>
            <td><b>TunedBass order ID</b></td>
            <td>${tunedbassOrderId}</td>
          </tr>
          <tr>
            <td><b>Paypal order ID</b></td>
            <td>${paypalOrderId}</td>
          </tr>
          <tr>
            <td><b>Status</b></td>
            <td>${status}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h4>Here is your unique download link: [valid for 1hr]</h4>
    <a class="btn btn-primary" href="${downloadUrl}">Download</a>
    <a class="btn btn-danger" href="${refreshUrl}">Request new download link</a>

   
  </div>
  `
    let mailRes = await sendMail("TunedBass order complete", mailBody,order.creator.email)
    if (!mailRes) throw new Error("Could not send email")

    for (let it of order.items){
      let track = await TrackModel.findById(it.id).exec()
      track.sold = true
      track.save()
    }
    order.complete = true
    order.save()
    res.send('ok')
  } catch (err) {
    console.log(err);
    res.status(500).json(requestErr());
  }
});
router.post("/create", async (req, res) => {
  try {
    let { name, email, items } = req.body;
    items = JSON.parse(items);
    let order = new Order();
    order.creator = { name, email };
    let total = 0;

    for (let item of items) {
      try {
        let tp = parseFloat(item.price);
        if (tp.isNaN) {
          console.log("not a number");
          throw SyntaxError;
        } else total += tp;
        //
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    order.items = items
    order.total = total;
    order.save();
    res.send(order.id);
  } catch (err) {
    console.log(err);
    res.status(500).json(requestErr());
  }
});
module.exports = router;