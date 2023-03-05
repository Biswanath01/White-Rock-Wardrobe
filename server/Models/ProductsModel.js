const mongoose = require('mongoose');


const productModel = new mongoose.Schema({ 
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },   
    price : {
        type : Number,
        required : true
    },
    userId : {
        type : String,
        required : true,
        // unique : true    
    },
    itemId : {
        type : String,
        required : true,
        unique : true
    },
    image : {
        data : Buffer,
        contentType : String
    },
    rating : {
        rate : Number,
        count : Number
    }
})

module.exports = mongoose.model('ProductModel', productModel);
