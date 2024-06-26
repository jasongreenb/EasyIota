require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer"); // Middleware for handling multipart/form-data (files)
const mysql = require("mysql2");
const parseCSV = require("./fileParser");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const cron = require("node-cron");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

async function handleParse(file) {
  const results = [];
  await parseCSV(file, results);
  return results;
}

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

const uploadRoute = require("./routes/file_upload_routes/upload_post_route");
const getRoute = require("./routes/file_retrieve_routes/upcoming_get_route");
const updateRoute = require("./routes/file_update_routes/update_post_route");
const getTablesRoute = require("./routes/table_get_routes/table_get_route");
const loginRoute = require("./routes/login_routes/login");
const EmailRoute = require("./routes/mailer_routes/send_email");

server.use("/", uploadRoute({ handleParse, db, s3Client, upload, uploadToB2 }));
server.use("/", getRoute({ db }));
server.use("/", updateRoute({ db }));
server.use("/", getTablesRoute({ db }));
server.use("/", loginRoute());
server.use("/", EmailRoute({ db }));

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

cron.schedule("11 15 * * *", async () => {
  try {
    const token = jwt.sign({}, process.env.SECRET_KEY, { expiresIn: "1d" });

    const response = await axios.post(
      "http://localhost:8000/api/send-email",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API RESPONSE: ", response.data);
  } catch (error) {
    console.error("Error calling API: ", error.message);
  }
});
process.stdin.resume();
