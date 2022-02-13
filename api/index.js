'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 1019;

mongoose.connect('mongodb+srv://admin:B4D2HT7BhZjEy6GB@cluster0.sckqe.mongodb.net/musicalyJDB?retryWrites=true&w=majority', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Base al 100')
        app.listen(port, function() {
            console.log('Servidor corriendo');
        })
    }
});