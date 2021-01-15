/**
 * =============================
 * Port
 * =============================
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * =============================
 * Port
 * =============================
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * =============================
 * Data Base
 * =============================
 */

let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb+srv://thalia:iRYFkLHqhZyOPuu9@cluster0.vwkwt.mongodb.net/cafe';
}

process.env.URLDB = urlDB;