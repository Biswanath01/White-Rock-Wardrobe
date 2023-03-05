const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const app = express();      //making the express backend

app.use(bodyParser.json());         //some settings
app.use(bodyParser.urlencoded({
    extended: true
}));

//Routing ('/api', '/add-to-cart/' => [which is in the CartRoute file]) 
app.use('/api', require('./Routes/CartRoute'));
app.use('/api', require('./Routes/AuthRoute'));
app.use('/api', require('./Routes/ProductRoute'));
app.use('/api', require('./Routes/ReviewsRoute'));
app.use('/api', require('./Routes/ProfileRoute'));
app.use('/api', require('./Routes/DpRoute'));
app.use('/api', require('./Routes/CategoryRoute'));

//connecting the backend with the DB
mongoose.connect("mongodb://localhost:27017/newshopping", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((res)=> console.log("Connected to DB"))
.catch((err)=> console.log("Error connecting to DB", err))

//Starting the server
app.listen(8001, ()=>{
    console.log("Server running on Port 8001");
})
