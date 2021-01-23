const express = require('express');
const fs = require('fs');
const path = require('path');
const { validateToken } = require('../middlewares/authentication');

let app = express();

app.get('/image/:type/:img', validateToken, (req, res) => {
  let type = req.params.type;
  let img = req.params.img;

  let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);

  if (fs.existsSync(pathImage)) {
    res.sendFile(pathImage);
  } else {
    res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
  }
});

module.exports = app;