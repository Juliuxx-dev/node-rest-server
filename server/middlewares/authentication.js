const jwt = require('jsonwebtoken');
/** 
 * ==============
 * Validate Token
 * ==============
 */

let validateToken = (req, res, next) => {
  let token = req.query.token || req.get('token');

  jwt.verify(token, process.env.AUTH_SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Invalid token'
        }
      });
    }

    req.user = decoded.user;
    next();
  });

};

let isAdmin = (req, res, next) => {
  let user = req.user;

  if (user?.role === 'ADMIN') {
    next();
  } else {
    res.status(401).json({
      ok: false,
      err: {
        message: 'This user is not an ADMIN'
      }
    });
  }
  
};

module.exports = {
  validateToken,
  isAdmin
}