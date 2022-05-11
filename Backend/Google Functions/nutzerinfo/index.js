const functions = require("firebase-functions");
const express = require("express");
const usersApp = express();
const admin = require("firebase-admin");

const cors = require("cors");
//usersApp.use(cors({origin: true}));

usersApp.use(cors());
usersApp.options('*', cors());
app = admin.initializeApp();

const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 1,
  socketPath: "/cloudsql/" + "webshop-316612:europe-west3:webshop",
  user: "root",
  password: "webshop",
  database: "Nutzerinfo",
});

// get all users
usersApp.get("/getAllUsers", async (req, res) => {
  
  if(req.header('token') == null) {
    return res.status(403).send("No token provided. "+ req.header("token"));
  }

  const idToken = req.header("token");
  const claims = await admin.auth().verifyIdToken(idToken);
  if (!claims.admin == true) {
    res.set({"Access-Control-Allow-Origin": "*"});
    res.status(401).send("You are not an admin!");
  }
    
  // using pool instead of creating connection with function call
  pool.query("SELECT * FROM nutzerinformation;", function(err, results) {
    if (err != null) {
      
      res.status(400).send(err);
    } else {
      
      res.status(200).send(results);
    }
  });
  
});

// get user by Email
usersApp.get("/:email", async (req, res) => {
  // using pool instead of creating connection with function call
  if(req.header('token') == null) {
    return res.status(403).send("No token provided. "+ req.header("token"));
  }
  const idToken = req.header("token");
  const claims = await admin.auth().verifyIdToken(idToken);
  if (claims.email != req.params.email) {
    res.set({"Access-Control-Allow-Origin": ""});
    res.status(401).send("Not the same user"+req.params.email+"claims:"+claims.email);
  }
  pool.query(
      "SELECT * FROM nutzerinformation where email = ?",
      req.params.email,
      function(err, results) {
        if (err != null) {
          res.status(400).send(err);
        } else {
          res.status(200).send(results);
        }
      },
  );
});

usersApp.post("/submit", async (req, res) => {
  // using pool instead of creating connection with function call
  pool.query(
      "INSERT INTO nutzerinformation " +
        "(email, nachname, vorname, telefonnummer, adresse) values (? , ? , ? , ? , ?);",
        [req.body.email, req.body.nachname, req.body.vorname, req.body.telefonnummer, req.body.adresse],
      function(err, results) {
        if (err != null) {
          res.status(400).send(err);
        } else {
          res.status(201).send(results);
        }
      },
  );
});


usersApp.put("/edit/:email", async (req, res) => {
  // using pool instead of creating connection with function call
  if(req.header("token") == null) {
    res.set({"Access-Control-Allow-Origin": ""});
    return res.status(403).send("No token provided.");
  }
  const idToken = req.header("token");
  const claims = await admin.auth().verifyIdToken(idToken);
  if (claims.email != req.params.email) {
    res.set({"Access-Control-Allow-Origin": ""});
    res.status(401).send("Not the same user");
  }
  pool.query(
      "UPDATE nutzerinformation SET nachname = ? , vorname = ? , telefonnummer = ? , adresse = ? WHERE email = ?",
      [req.body.nachname, req.body.vorname, req.body.telefonnummer, req.body.adresse, req.params.email],
      function(err, results) {
        if (err != null) {
          res.status(400).send(err);
        } else {
          res.status(201).send(results);
        }
      },
  );
});

usersApp.delete("/delete/:email", async (req, res) => {
   if(req.header("token") == null) {
    res.set({"Access-Control-Allow-Origin": "*"});
    return res.status(403).send("No token provided.");
  }
  const idToken = req.header("token");
  const claims = await admin.auth().verifyIdToken(idToken);
  if (!claims.admin == true) {
    res.set({"Access-Control-Allow-Origin": "*"});
    res.status(401).send("You are not an admin!");
  }
  // using pool instead of creating connection with function call
  pool.query(
      "DELETE FROM nutzerinformation WHERE email = ?",
      req.params.email,
      function(err, results) {
        if (err != null) {
          res.status(400).send(err);
        } else {
          res.status(200).send(results);
        }
      },
  );

// Delete a User from Firebase Auth
admin.auth().getUserByEmail(req.params.email)
  .then((user) => {
    return admin.auth().deleteUser(user.uid);
  })
  .then(() => {
    return app.delete();
  });
});


exports.nutzerinfo = functions.region("europe-west3").https.onRequest(usersApp);
