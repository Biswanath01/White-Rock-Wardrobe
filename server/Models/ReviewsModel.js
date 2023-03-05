const mongoose = require('mongoose');

const reviewsModel = new mongoose.Schema({  
    userId : {
        type : String,
        required : true,
        // unique : true
    },
    review : {
        type : String,
        required : true
    },
    itemId : {
        type : String,
        required : true,
        // unique : true
    },
    createdAt : {
        type : Date,
        required : true
    },
    rating : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('reviewsModel', reviewsModel);