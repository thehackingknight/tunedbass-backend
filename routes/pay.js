const router = require("express").Router();
const { Client, Environment, ApiError } = require("square");
const { randomUUID } = require("crypto");
const multer = require("multer");

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const paymentsApi = () =>
  new Client({
    accessToken: false ? "EAAAFD64CfZ4Lnefd7Kvbaijr9ks26ZI8x7U3gKmns_ts2TBN-mLx8lN5_kA_49_" : process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Sandbox,
  }).paymentsApi;

router.post("/", multer().none(), async (req, res) => {
  try {
    const { result } = await paymentsApi().createPayment({
      idempotencyKey: randomUUID(),
      sourceId: req.body.sourceId,
      amountMoney: {
        currency: "USD",
        amount: parseInt(req.body.amount),
      },
    });
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof ApiError) {
      err.result.errors.forEach(function (e) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log("Unexpected error occurred: ", err);
    }
    res.status(500).send("Something went wrong");
  }
});
module.exports = router;
