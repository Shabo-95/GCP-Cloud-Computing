const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.checkAdminRole = functions
    .https.onCall((data, context) => {
      if (context.auth.token.admin === true) {
        return true;
      }
      return false;
    });
