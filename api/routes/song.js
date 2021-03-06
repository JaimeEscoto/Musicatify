'use strict'
var express = require('express');
var SongController = require('../controllers/song')
var md_auth = require('../middlewares/authenticated')

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' })

var api = express.Router();


api.get('/get-song/:id?', md_auth.ensureAuth, SongController.getSong);
api.get('/get-songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/save-song/', md_auth.ensureAuth, SongController.saveSong);


api.post('/upload-song-file/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile)
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;