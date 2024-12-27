const express= require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const wishlistRoutes = require('./routes/wishlist-routes');
const cartRoutes = require('./routes/cart-routes');
const userRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});
app.use('/api/wishlist',wishlistRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/users',userRoutes);
app.use((req,res,next) => {
    throw new HttpError('Could not find this route.', 404);
});

app.use((error,req,res,next) => {
    if(res.headerSent)
        return next(error);
    res.status(error.code || 500);
    res.json({message: error.message || 'An error error occured!'});

});

mongoose
.connect('mongodb+srv://Rounak744:7hHk34G@cluster0.pbpbz.mongodb.net/dvdapp?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    app.listen(5000);
})
.catch((err)=>{
    console.log(err);
});
