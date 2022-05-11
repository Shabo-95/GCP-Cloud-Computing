const functions = require("firebase-functions");
const express = require("express");
const bestellungenApp = express();

const cors = require("cors");
bestellungenApp.use(cors({origin: true}));

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Get All Orders
bestellungenApp.get("/", async (req, res) => {
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
  const snapshot = await db.collection("bestellungen").get();
  const bestellungen = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    bestellungen.push({id, ...data});
  });
  res.status(200).send(JSON.stringify(bestellungen));
});

// Add a new Order
bestellungenApp.post("/", async (req, res) => {
  if(req.header("token") == null) {
    res.set({"Access-Control-Allow-Origin": ""});
    return res.status(403).send("No token provided.");
  }
  const idToken = req.header("token");
  const claims = await admin.auth().verifyIdToken(idToken);
  if (claims.email != req.body.email) {
    res.set({"Access-Control-Allow-Origin": ""});
    res.status(401).send("Not the same user");
  }
  const data = req.body;
  const uid = req.header("uid") //claims.uid
  await db.collection("bestellungen").add(data);
  res.status(201).send("Bestellung wurde erfolgreich erstellt");
});

// Get User Orders bei email
bestellungenApp.get("/:email", async (req, res) => {
  if(req.header("token") == null) {
    res.set({"Access-Control-Allow-Origin": "*"});
    return res.status(403).send("No token provided.");
  }
  const idToken = req.header("token");
  const claims = await admin.auth().verifyIdToken(idToken);
  if (claims.email != req.params.email) {
    res.set({"Access-Control-Allow-Origin": "*"});
    res.status(401).send("You are not an admin!");
  }
  const snapshot = await db.collection("bestellungen").where('email', '==', req.params.email).get();
  const userBestellungen = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    userBestellungen.push({id, ...data});
  });
  res.status(200).send(JSON.stringify(userBestellungen));
});

exports.bestellungen = functions
    .region("europe-west3")
    .https.onRequest(bestellungenApp);
