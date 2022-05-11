const functions = require("firebase-functions");
const express = require("express");
const Multer = require("multer");
const app = express();
const Busboy = require("busboy");
const {Storage} = require("@google-cloud/storage");
const path = require("path");
const os = require("os");
const fs = require("fs");

const admin = require("firebase-admin");
admin.initializeApp();

const cors = require("cors");
app.use(cors({origin: true}));

const storage = new Storage({
  projectId: "webshop-316612",
  keyFilename: "webshop-316612-firebase-adminsdk-p5a75-9e1a67d6a9.json",
});
const bucket = storage.bucket("webshop-316612.appspot.com");

const multer = new Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// delete a specific image
app.get("/delete", async (req, res) => {
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
  if (req.query.product != null) {
    await bucket.file(req.query.product).exists()
      .then(async function() {
        await bucket.file(req.query.product).delete();
        res.set({"Access-Control-Allow-Origin": "*"});
        res.status(200).send("File was deleted!");
      })
      .catch(function() {
        res.set({"Access-Control-Allow-Origin": "*"});
        res.status(404).send("File not found!");
      });
  } else {
    res.set({"Access-Control-Allow-Origin": "*"});
    res.status(422).send("No product query parameter has been given!");
  }
});

// get image URL for a specific product
app.get("/getURL", async (req, res) => {
  if (req.query.product != null) {
    await bucket.file(req.query.product).exists()
      .then(function() {
        const url = "https://storage.googleapis.com/webshop-316612.appspot.com/" + req.query.product;
        res.set({"Access-Control-Allow-Origin": "*"});
        res.send(url);
      })
      .catch(function() {
        res.set({"Access-Control-Allow-Origin": "*"});
        res.send("File not found!");
      });
  } else {
    res.set({"Access-Control-Allow-Origin": "*"});
    res.send("No product query parameter has been given!");
  }
});

app.post("/upload2",async (req, res) => {
  if (req.method !== "POST") {
    res.set({"Access-Control-Allow-Origin": "*"});
    return res.status(405).end();
  }
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
  const busboy = new Busboy({headers: req.headers});
  const tmpdir = os.tmpdir();

  const fields = {};
  const uploads = {};

  busboy.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  const fileWrites = [];

  // This code will process each file uploaded.
  busboy.on("file", (fieldname, file, filename) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written to disk.
    const promise = new Promise((resolve, reject) => {
      file.on("end", () => {
        writeStream.end();
      });
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  busboy.on("finish", () => {
    Promise.all(fileWrites).then(() => {
      if(true){
        for (const name in uploads) {
          const file = uploads[name];
          async function upload2bucket() {
            let fileRes = await bucket.upload(file);
            fs.unlinkSync(file);
            res.set({"Access-Control-Allow-Origin": "*"});
            res.status(200).send("Sucessfull");
          }
          upload2bucket();
        }}
    });
  });
  busboy.end(req.rawBody);
});

exports.imageService = functions.region("europe-west3").https.onRequest(app);
