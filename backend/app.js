const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(express.json()); //Pro zpracování JSONu při body request
app.use(bodyParser.urlencoded( { extended: true } )) //Zpracování formData

// Middleware pro povolení CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

//Modules
const categoryModule = require('./routes/categories');
app.use('/category', categoryModule);

const productModule = require('./routes/products');
app.use('/product', productModule);

const orderModule = require('./routes/orders');
app.use('/order', orderModule);

const accountantModule = require('./routes/accountant');
app.use('/accountant', accountantModule);

const fileModule = require('./routes/file');
app.use('/file', fileModule);

module.exports = app;