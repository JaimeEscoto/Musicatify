'use strict'

var fs = require('fs');
var path = require('path');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePagination = require('mongoose-pagination');

function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artista) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición de artista' });
            } else {
                if (artista) {
                    res.status(200).send({ artist: artista });
                } else {
                    res.status(404).send({ message: 'El artista no existe' });
                }
            }
        })
        //res.status(200).send({ message: 'funcionando controller de artist' });
}

function getArtists(req, res) {
    if (req.params.page) { var page = req.params.page; } else { var page = 1; }
    var itemsPerPage = 3;
    //console.log(itemsPerPage);
    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total) {
        console.log(artists);
        if (err) {
            res.status(500).send({ message: 'Error en la petición de artistas paginados' });
        } else {
            if (artists) {
                res.status(200).send({
                    total_items: total,
                    artists: artists
                });

            } else {
                res.status(404).send({ message: 'No hay artistas' });
            }



        }

    })
}

function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'Null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });
        } else {
            if (artistStored) {
                res.status(200).send({ artist: artistStored });
            } else {
                res.status(404).send({ message: 'Error al guardar el artista' });
            }

        }

    })

}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) { res.status(500).send({ message: 'Error en la petición de update de artista' }); } else {
            if (artistUpdated) {
                res.status(200).send({ artist: artistUpdated });

            } else {

                res.status(404).send({ message: 'Error en el  update de artista' });
            }

        }

    });

}

function deleteArtist(req, res) {
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición de delete de artista' });

        } else {

            if (artistRemoved) {

                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error en la petición de delete de album' });
                    } else {
                        if (albumRemoved) {
                            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en la petición de delete de song' });
                                } else {
                                    if (songRemoved) {
                                        res.status(200).send({ artist: artistRemoved });
                                    } else {
                                        res.status(404).send({ message: 'Error en la elminacion de Song' });
                                    }
                                }

                            });
                        } else {
                            res.status(404).send({ message: 'Error en la elminacion de Album' });
                        }
                    }

                });

            } else { res.status(404).send({ message: 'Error en la elminacion de artista' }); }
        }

    })
}


function uploadImage(req, res) {
    var userId = req.params.id;
    console.log(userId);
    var fileName = 'No subido';
    console.log(req.files);
    if (req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var ext_split = fileName.split('\.');
        var fileExt = ext_split[1];

        if (fileExt == 'PNG' || fileExt == 'jpg' || fileExt == 'gif') {
            Artist.findByIdAndUpdate(userId, { image: fileName }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualiza el usuario' });
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({ message: 'No se pudo actualizar', err: err });
                    } else {
                        res.status(200).send({ oldUser: artistUpdated });
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

function getImageFile(req, res) {
    console.log(req.params)
    var imageFile = req.params.imageFile;
    console.log(imageFile)
    var fileName = './uploads/artists/' + imageFile;
    fs.exists(fileName, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(fileName));

        } else {
            res.status(404).send({ message: 'No existe imagen' });
        }

    })
}



module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}