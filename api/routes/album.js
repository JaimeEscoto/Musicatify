'use strict'
var express = require('express');
var AlbumController = require('../controllers/album')
var md_auth = require('../middlewares/authenticated')

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums' })

var api = express.Router();


api.get('/get-album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/get-all-albums/:page?', md_auth.ensureAuth, AlbumController.getAllAlbums);
api.get('/get-albums-by-artist/:artist?', md_auth.ensureAuth, AlbumController.getAlbumsByArtist);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/save-album', md_auth.ensureAuth, AlbumController.saveAlbum);

api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage)
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);



module.exports = api;