const express = require("express");
const multer = require("multer"); // Middleware for handling multipart/form-data (files)
const mysql = require("mysql2");
const parseCSV = require("./fileParser");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
// const result = require("dotenv").config();
// // console.log(result.parsed); // Should log the parsed contents of your .env file

async function handleParse(file) {
  const results = [];
  await parseCSV(file, results);
  return results;
}

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const port = 8000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "easyiota",
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

    server.listen(port, function check(error) {
      if (error) {
        console.error("Error connecting to the server: ", error);
      } else {
        console.log(`Successfully connected to the server on port ${port}`);
      }
    });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

async function uploadToB2(file) {
  const uploadParams = {
    Bucket: "sober-sheet-uploads",
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
    res.status(200).send("File uploaded successfully");

    const results = await handleParse(file.buffer);
    const createQuery = process.env.createquery;

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
      db.query(createQuery, (err, result) => {
        if (err) {
          return res.status(500).send("Failed to create new database");
        } else {
        }
      });
      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error inserting data: ", err);
          return res.status(500).send("Failed to insert data");
        }

        // UNCOMMENT TO SEE RESULT OF INSERTION, example success ->

        /*
        Inserted data:  ResultSetHeader {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 5,
          info: '',
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 0
        }
        Inserted data:  ResultSetHeader {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 6,
          info: '',
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 0
        }
      */

        // console.log("Inserted data: ", result);
        // if (result) {
        //   console.log("SUCCESS!");
        // }
      });
    }

    res.send("File uploaded and data inserted");
  } catch (err) {
    console.error("Error parsing file: ", err);
    res.status(500).send(err.message);
  }
});
