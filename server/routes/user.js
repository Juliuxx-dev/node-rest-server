const express = require('express');
const app = express();
const User = require('../models/user');
const { validateToken, isAdmin } = require('../middlewares/authentication');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/', function (req, res) {
  res.json('Home usuario');
});

app.get('/usuario', validateToken, (req, res) => {
  let from = req.query.from || 0;
  from = Number(from);

  let limit = req.query.limit || 5;
  limit = Number(limit)

  User.find({ status: true }, 'name email role status google img')
  .skip(from)
  .limit(limit)
    .exec( (err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      User.count({ status: true }, (err, total) => {
        res.json({
          ok: true,
          users,
          total
        });
      });

    });
});

app.post('/usuario', [validateToken, isAdmin], (req, res) => {
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save( (err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.status(201).json({
      ok: true,
      user: userDB
    });
  });
});

app.put('/usuario/:id', [validateToken, isAdmin], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, user) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      user
    });
  });

});

app.delete('/usuario/:id', [validateToken, isAdmin], (req, res) => {
  let id = req.params.id;

  User.findByIdAndUpdate(id, { status: false }, { new: true }, (err, user) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!user) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'User not found'
          }
        })
    }

    res.json({
      ok: true,
      user
    });
  });

  ///////////////////
  // User.findByIdAndRemove(id, (err, removedUser) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });
  //   }
  
  //   if (!removedUser) {
  //       return res.status(400).json({
  //         ok: false,
  //         err: {
  //           message: 'User not found'
  //         }
  //       })
  //   }
  
  //   res.json({
  //     ok: true,
  //     user: removedUser
  //   });
  // });
  // });
  //////////////////
});


module.exports = app;