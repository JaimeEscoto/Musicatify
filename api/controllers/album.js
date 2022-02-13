'use strict'

var fs = require('fs');
var path = require('path');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePagination = require('mongoose-pagination');

function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: 'Error en servidor' });
        } else {
            if (album) {
                res.status(200).send({ album: album });
            } else {
                res.status(404).send({ message: 'Album no existe' });
            }
        }


    });


}

function saveAlbum(req, res) {

    var album = new Album();
    var params = req.body;
    album.tittle = params.tittle;
    album.description = params.description;
    album.year = params.year;
    album.image = 'Null';
    album.artist = params.artist;
    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en servidor' });
        } else {
            if (albumStored) {
                res.status(200).send({ album: albumStored });
            } else {
                res.status(404).send({ message: 'No se ha guardado el album' });
            }
        }

    });

    //res.status(200).send({ message: 'Listo' });
    //res.status(200).send({ message: 'funcionando controller de artist' });
}

function getAllAlbums(req, res) {
    if (req.params.page) { var page = req.params.page; } else { var page = 1; }
    var itemsPerPage = 3;
    //console.log(itemsPerPage);
    Album.find().sort('name').populate({ path: 'artist' }).paginate(page, itemsPerPage, function(err, albums, total) {
        console.log(albums);
        if (err) {
            res.status(500).send({ message: 'Error en la petición de albums paginados' });
        } else {
            if (albums) {
                res.status(200).send({
                    total_items: total,
                    albums: albums
                });

            } else {
                res.status(404).send({ message: 'No hay albums' });
            }
        }

    })
}

function getAlbumsByArtist(req, res) {

    var artistId = req.params.artist;
    if (artistId) {
        var find = Album.find({ artist: artistId }).sort('year')

    } else {
        var find = Album.find({}).sort('tittle')
    }

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición de albums' });
        } else {
            if (albums) {
                res.status(200).send({

                    albums: albums
                });

            } else {
                res.status(404).send({ message: 'No hay albums' });
            }
        }
    });


}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) { res.status(500).send({ message: 'Error en la petición de update de album' }); } else {
            if (albumUpdated) {
                res.status(200).send({ album: albumUpdated });
            } else {

                res.status(404).send({ message: 'Error en el  update de album' });
            }
        }

    });

}

function deleteAlbum(req, res) {
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumIdRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición de delete de artista' });

        } else {

            if (albumIdRemoved) {
                Song.find({ album: albumIdRemoved._id }).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error en la petición de delete de album' });
                    } else {
                        if (songRemoved) {
                            res.status(200).send({ album: albumIdRemoved });
                        } else {
                            res.status(404).send({ message: 'Error en la elminacion de Song' });
                        }
                    }
                });

            } else { res.status(404).send({ message: 'Error en la elminacion de artista' }); }



        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    //console.log(userId);
    var fileName = 'No subido';
    console.log(req.files);
    console.log(albumId);
    if (req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var ext_split = fileName.split('\.');
        var fileExt = ext_split[1];

        if (fileExt == 'PNG' || fileExt == 'jpg' || fileExt == 'gif') {
            Album.findByIdAndUpdate(albumId, { image: fileName }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualiza el album' });
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({ message: 'No se pudo actualizar', err: err });
                    } else {
                        res.status(200).send({ oldAlbum: albumUpdated });
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
    //console.log(req.params)
    var imageFile = req.params.imageFile;
    //console.log(imageFile)
    var fileName = './uploads/albums/' + imageFile;
    fs.exists(fileName, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(fileName));

        } else {
            res.status(404).send({ message: 'No existe imagen' });
        }

    })
}





module.exports = { getAlbum, saveAlbum, getAllAlbums, getAlbumsByArtist, updateAlbum, deleteAlbum, uploadImage, getImageFile };