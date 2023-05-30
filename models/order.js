const { Schema, Types, model } = require("mongoose");

 class CreatorCreator {
    name = ""
    email = ""

    constructor(name, email){
        this.name = name
        this.email = email
    }

    toString(){
        return this.name + " "
    }
}
const OrderSchema = new Schema({
    total: {
        type: Number,
        default: 0,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    paypal_details: Object,
    items: {
        type: [],
        default: []
    },
    given_name: String,
    creator: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: new Date()
    },
    last_modified: {
        type: Date,
        default: new Date()
    },
})

const Order = model("Order", OrderSchema)
module.exports = Order