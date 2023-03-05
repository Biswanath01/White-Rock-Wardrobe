const mongoose = require('mongoose');

const dpModel = new mongoose.Schema({
    userId : {
        type : String,
        required : true,
        unique : true
    },
    userProfilePic : {
        data : Buffer,
        contentType : String
    }
})

module.exports = mongoose.model('DpModel', dpModel);