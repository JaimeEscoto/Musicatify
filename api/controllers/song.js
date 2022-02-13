'use strict'

var fs = require('fs');
var path = require('path');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePagination = require('mongoose-pagination');

function getSong(req, res) {
    var songId = req.params.id;
    Song.findById(songId).populate({ path: 'album' }).exec((err, song) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición de song' });
            } else {
                if (song) {
                    res.status(200).send({ song: song });
                } else {
                    res.status(404).send({ message: 'El song no existe' });
                }
            }
        })
        //res.status(200).send({ message: 'funcionando controller de artist' });
}

function getSongs(req, res) {
    var albumId = req.params.album;
    console.log(albumId);
    if (albumId) {
        var find = Song.find({ album: albumId }).sort('number')

    } else {
        var find = Song.find({}).sort('name')
    }
    //var songId = req.params.id;
    find.populate({ path: 'album', populate: { path: 'artist', model: 'Artist' } }).exec((err, song) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición de song' });
            } else {
                if (song) {
                    res.status(200).send({ song: song });
                } else {
                    res.status(404).send({ message: 'El song no existe' });
                }
            }
        })
        //res.status(200).send({ message: 'funcionando controller de artist' });
}

function saveSong(req, res) {

    var song = new Song();
    var params = req.body;
    console.log(params);
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'Null';
    song.album = params.album;
    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en servidor' });
        } else {
            if (songStored) {
                res.status(200).send({ album: songStored });
            } else {
                res.status(404).send({ message: 'No se ha guardado el album' });
            }
        }

    });


}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) { res.status(500).send({ message: 'Error en la petición de update de song' }); } else {
            if (songUpdated) {
                res.status(200).send({ album: songUpdated });
            } else {

                res.status(404).send({ message: 'Error en el  update de song' });
            }
        }

    });

}

function deleteSong(req, res) {
    var songId = req.params.id;
    console.log(songId);
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición de delete de cancion' });

        } else {

            if (songRemoved) {

                res.status(200).send({ song: songRemoved });

            } else {
                res.status(404).send({ message: 'Error en la elminacion de cancion' })





            }
        }
    });
}

//----------------------------------


function uploadFile(req, res) {
    var songId = req.params.id;
    console.log(songId);
    var fileName = 'No subido';
    console.log(req.files);
    //console.log(albumId);
    if (req.files) {
        var filePath = req.files.file.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var ext_split = fileName.split('\.');
        var fileExt = ext_split[1];

        if (fileExt == 'mp3') {
            Song.findByIdAndUpdate(songId, { file: fileName }, (err, songUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualiza el song' });
                } else {
                    if (!songUpdated) {
                        res.status(404).send({ message: 'No se pudo actualizar', err: err });
                    } else {
                        res.status(200).send({ song: songUpdated });
                    }
                }

            })

        } else {
            res.status(400).send({ message: 'Extension no valida' });
        }


    } else {
        res.status(400).send({ message: 'Imagen no se subio' });
    }

}

function getSongFile(req, res) {
    //console.log(req.params)
    var songFile = req.params.songFile;
    //console.log(imageFile)
    var fileName = './uploads/songs/' + songFile;
    fs.exists(fileName, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(fileName));

        } else {
            res.status(404).send({ message: 'No existe imagen' });
        }

    })
}






module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile


}