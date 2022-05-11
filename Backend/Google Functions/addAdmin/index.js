const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addAdmin = functions.https.onCall((data, context) => {
if(context.auth.token.admin !== true) {
  return { error: 'Only admins can add other admins.' }
}

//get user and add custom claim (admin)
  return admin
      .auth()
      .getUserByEmail(data.email)
      .then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
          admin: true,
        });
      })
      .then(() => {
        return {
          message: "Success." + data.email + "is now is an admin.",
        };
      })
      .catch((err) => {
        return err;
      });
});