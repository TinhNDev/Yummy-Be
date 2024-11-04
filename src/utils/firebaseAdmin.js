<<<<<<< HEAD
const admin = require('firebase-admin');
const serviceAccount = require('../../fbconfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
=======
const admin = require('firebase-admin');
const serviceAccount = require('../../fbconfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
