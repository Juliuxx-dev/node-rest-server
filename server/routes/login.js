const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {
  let body = req.body;

  User.findOne({ email: body.email}, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User or password incorrect'
        }
      });
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User or password incorrect'
        }
      });  
    }
    
    let token = jwt.sign({
      user
    }, process.env.AUTH_SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

    res.json({
      ok: true,
      user,
      token
    });
  });

});

// Google Config
async function verify( token ) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

// verify().catch(console.error);

app.post('/google', async (req, res) => {
  let token = req.body.idtoken;
  
  let googleUser = await verify(token)
    .catch(err => {
      return res.status(403).json({
        ok: false,
        err
      });
    })

  User.findOne( { email: googleUser.email}, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (user) {
      if (user.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'You must use normal authentication'
          }
        });
      } else {
        let token = jwt.sign({
          user
        }, process.env.AUTH_SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

        return res.json({
          ok: true,
          user,
          token
        });
      }
    } else {
      //If is a new user
      let newUser = new User();
      newUser.name = googleUser.name;
      newUser.email = googleUser.email;
      newUser.img = googleUser.img;
      newUser.google = true;
      newUser.password = ':)';

      newUser.save( (err, user) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        
        let token = jwt.sign({
          user
        }, process.env.AUTH_SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

        return res.json({
          ok: true,
          user,
          token
        });

      });
    }
  });
});

module.exports = app;