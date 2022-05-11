const functions = require("firebase-functions");
const express = require("express");
const produkteApp = express();

const cors = require("cors");
produkteApp.use(cors({origin: true}));

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Get All Produkts
produkteApp.get("/", async (req, res) => {
  const snapshot = await db.collection("produkte").get();
  const produkte = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    produkte.push({id, ...data});
  });
  res.status(200).send(JSON.stringify(produkte));
});

// Add a new Produkt
produkteApp.post("/", async (req, res) => {
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
  const product = req.body;
  await db.collection("produkte").add(product);
  res.status(201).send("Produkt wurde erfolgreich erstellt");
});

// Get a Single Produkt bei ID
produkteApp.get("/:id", async (req, res) => {
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
  const snapshot = await db.collection("produkte").doc(req.params.id).get();
  const productId = snapshot.id;
  const productData = snapshot.data();
  res.status(200).send(JSON.stringify({id: productId, ...productData}));
});

// Update a Produkt
produkteApp.put("/:id", async (req, res) => {
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
  const body = req.body;
  await db.collection("produkte").doc(req.params.id).update(body);
  res.status(200).send("Erfolgreich geupdated");
});

// Delete a Produkt
produkteApp.delete("/:id", async (req, res) => {
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
  await db.collection("produkte").doc(req.params.id).delete();
  res.status(200).send("Produkt wurde erfolgreich gelöscht");
});

exports.produkte = functions.region("europe-west3").https
    .onRequest(produkteApp);