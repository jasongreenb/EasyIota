const express = require("express");
const cors = require("cors");
const multer = require("multer"); // Middleware for handling multipart/form-data (files)
const mysql = require("mysql2");
const parseCSV = require("./fileParser");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

async function handleParse(file) {
  const results = [];
  await parseCSV(file, results);
  return results;
}

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

const s3Client = new S3Client({
  endpoint: "https://s3.us-east-005.backblazeb2.com",
  region: "us-east-005",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

db.connect((e) => {
  if (e) {
    console.error("Error connecting to DB: ", e);
  } else {
    console.log("Connected to DB successfully");

    server.listen(process.env.port, function check(error) {
      if (error) {
        console.error("Error connecting to the server: ", error);
      } else {
        console.log(
          `Successfully connected to the server on port ${process.env.port}`
        );
      }
    });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

async function uploadToB2(file) {
  const uploadParams = {
    Bucket: process.env.bucket,
    Key: `${Date.now()}_${file.originalname}`, // Unique file name
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);
}

server.post("/uploadcsv", upload.single("file"), async (req, res) => {
  const file = req.file;

  const tableName = req.body?.tableName;

  if (!file) {
    return res.status(400).send("No file uploaded");
  } else if (!tableName) {
    return res.status(400).send("No table name entered");
  }

  try {
    await uploadToB2(file);

    const results = await handleParse(file.buffer);
    const createQuery = process.env.createquery.replace(
      "??",
      mysql.escapeId(tableName)
    );

    let errors = [];

    db.query(createQuery, (err, result) => {
      if (err) {
        errors.push(err);
      }
    });

    for (const item of results) {
      const query = `INSERT INTO ${mysql.escapeId(
        tableName
      )} (Date, Day_Of_Week, \
        Officer, Officer_Phone_Num, Shotty, Shotty_Phone_Num,\
         Driver, Driver_Phone_Num, Venmo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        item.Date,
        item.Day,
        item.Officer,
        item.Officer_Phone_Num,
        item.Shotty,
        item.Shotty_Phone_Num,
        item.Driver,
        item.Driver_Phone_Num,
        item.Driver_venmo,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          errors.push(err);
        }
      });
    }

    if (errors.length > 0) {
      return res.status(500).send("Some queries failed");
    }
    res.send("File uploaded and data inserted");
  } catch (err) {
    console.error("Error parsing file: ", err);
    res.status(500).send(err.message);
  }
});
