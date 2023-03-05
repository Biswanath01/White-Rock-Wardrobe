const mongoose = require('mongoose');


//establishing the schema:
const cartModel = new mongoose.Schema({
    itemId : {
        type : Array
    },
    userId : {
        type : String,
        required : true,
        unique: true
    }
})

module.exports = mongoose.model('cartModel', cartModel)