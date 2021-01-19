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
 * Expiration Token
 * =============================
 *  60 secs
 *  60 mins
 *  24 hours
 *  30 days
 *  
*/

process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

 /**
 * =============================
 * Authentication seed
 * =============================
 */

process.env.AUTH_SEED = process.env.AUTH_SEED || 'dev-seed';

/**
 * =============================
 * Data Base
 * =============================
*/

let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/**
 * =============================
 * Google Client ID
 * =============================
*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '1008969614103-vkc5svkrejls0h6pg8g3mfoect62d418.apps.googleusercontent.com';