require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// public folder
// app.use(express.static(path.resolve(__dirname + '../public/')));
app.use(express.static(path.resolve(__dirname, '../public')));
// app.use(express.static(__dirname + '../public/'));

// routes config
app.use( require('./routes/index'));

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {
  if (err) throw err;
  
  console.log('DB ONLINE');
});

app.listen(process.env.PORT, () => {
  console.log(`Listening from port: ${process.env.PORT}`);
});