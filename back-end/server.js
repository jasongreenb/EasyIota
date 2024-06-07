const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const parseCSV = require("./fileParser");

const server = express();
const port = 3030;

async function handleParse(file) {
  const results = [];
  await parseCSV(file, results);
  return results;
}

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "easyiota",
});

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

db.connect((e) => {
  if (e) {
    console.error("Error connecting to DB");
  } else {
    console.log("Connected to DB successfully");

    server.listen(port, function check(error) {
      if (error) {
        console.error("Error connecting to the server");
      } else {
        console.log(`Successfully connected to the server on port ${port}`);
      }
    });
  }
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

server.post("/uploadcsv", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const results = await handleParse(file.path);

    console.log(results);

    console.log("Before query execution");
    for (let item of results) {
      const query =
        "INSERT INTO shifts_fall_25 (Date, Day_Of_Week, Officer, Officer_Phone_Num, Shotty, Shotty_Phone_Num, Driver, Driver_Phone_Num, Venmo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
          console.error("Error inserting data: ", err);
          return res.status(500).send("Failed to insert data");
        }

        console.log("Inserted data: ", result);
      });
    }

    console.log("After query execution");
    res.send("File uploaded and data inserted");
  } catch (err) {
    console.error("Error parsing file: ", err);
    res.status(500).send(err.message);
  }
});
