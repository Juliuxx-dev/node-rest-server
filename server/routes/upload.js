const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const { validateToken } = require('../middlewares/authentication');
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

const validExtensions = ['png', 'jpg', 'gif', 'jpeg'];


app.post('/upload/:type/:id', validateToken, function (req, res) {
  let id = req.params.id;
  let type = req.params.type;
  let name = req.body.name;
  let sampleFile;
  let uploadPath;

  if (!id) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'ID not provided'
      }
    });
  }

  // Validating types
  let validTypes = ['products', 'users'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `${type} is an invalid type, please use: (${validTypes.join(', ')})`
      }
    });
  }


  // validating file
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No files were uploaded.'
      }
    });
  }

  // The name of the input field (i.e. "file") is used to retrieve the uploaded file
  let file = req.files.file;
  let extension = file.name.split('.').pop().toLowerCase();
  let fileName = name ? `${name}.${extension}` : file.name;
  let uniqueFileName = `${Date.now()}${fileName}`;
  uploadPath = `uploads/${type}/${uniqueFileName}`;

  // Validating extensions
  if (!validExtensions.includes(extension)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `${extension} is an invalid extension, please use: (${validExtensions.join(', ')})`
      }
    });
  }

  // Use the mv() method to place the file somewhere on your server
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (type === 'users') {
      saveUserImage(id, res, uniqueFileName);
    } else if (type === 'products') {
      saveProductImage(id, res, uniqueFileName);
    }
  });
});

function saveUserImage(id, res, fileName) {
  User.findById(id, (err, userDB) => {
    if (err) {
      removeImgIfExists(fileName, 'users');

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!userDB) {
      removeImgIfExists(fileName, 'users');

      return res.status(400).json({
        ok: false,
        err: {
          message: 'User not found'
        }
      });
    }

    removeImgIfExists(userDB.img, 'users');

    userDB.img = fileName;
    userDB.save((err, savedUser) => {
      res.json({
        ok: true,
        user: savedUser,
        img: fileName
      })
    });


  });
}

function saveProductImage(id, res, fileName) {
  Product.findById(id, (err, productDB) => {
    if (err) {
      removeImgIfExists(fileName, 'products');

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      removeImgIfExists(fileName, 'products');

      return res.status(400).json({
        ok: false,
        err: {
          message: 'Product not found'
        }
      });
    }

    removeImgIfExists(productDB.img, 'products');

    productDB.img = fileName;
    productDB.save((err, savedProduct) => {
      res.json({
        ok: true,
        user: savedProduct,
        img: fileName
      })
    });


  });
}

function removeImgIfExists(img, type) {
  let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);

  if (fs.existsSync(pathImg)) {
    fs.unlinkSync(pathImg);
  }
}

module.exports = app;