'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');



function pruebas(req, res) {
    res.status(200).send({ message: 'Probando una accion del controlador de usuarios con node y mongo' });

}

function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    console.log(params)
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if (params.password) {
        // Encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                //guardar usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    } else {
                        res.status(200).send({ user: userStored });
                    }
                })

            } else {
                res.status(200).send({ message: 'Debes introducir todos los datos' });
            }

        })

        //res.status(500).send({ message: 'Bieeen!' });
    } else {
        res.status(200).send({ message: 'Introduce la contraseña' });
    }

}

function loginUser(req, res) {

    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error de BD' });
        } else {
            if (!user) {
                res.status(200).send({ message: 'El usuario no existe' });
            } else {
                // Comprobar la contraseña
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        //Devolver datos de usuario
                        if (params.gethash) {

                            //devolver tocken
                            res.status(200).send({ token: jwt.createToken(user) });

                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({ message: 'El usuario no ha podido login' });
                        //Usuario no ha podido login
                    }
                })
            }

        }

    })

}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualiza el usuario' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se pudo actualizar' });
            } else {
                res.status(200).send({ oldUser: userUpdated });
            }
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

        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif') {
            User.findByIdAndUpdate(userId, { image: fileName }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualiza el usuario' });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se pudo actualizar', err: err });
                    } else {
                        res.status(200).send({ image: fileName, user: userUpdated });
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
    var fileName = './uploads/users/' + imageFile;
    fs.exists(fileName, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(fileName));

        } else {
            res.status(404).send({ message: 'No existe imagen' });
        }

    })
}


module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};