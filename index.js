const express = require("express");
const mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const config = require("./config");
const logger = require("./utils/logger");
const fs = require("fs");
const path = require("path");
config.validateConfig(config);
const uri = config.db_uri;
require("dotenv").config();

mongoose
  .connect(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  .then(() => {
    console.log("Successfully connected to the database");

    app.use(cookieParser());
    app.use(
      cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
      })
    );
    app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(mongoSanitize());
    app.use((req, res, next) => {
      logger.info(`${req.ip} ${req.method} ${req.url}`);
      next();
    });

    const imagesPath = path.join(__dirname, "public/images");
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    }, express.static(imagesPath));

    app.use(
      "/md",
      (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // Allow cross-origin access
        next();
      },
      express.static(imagesPath),
      (req, res) => {
        const files = fs
          .readdirSync(imagesPath)
          .map((file) => `${req.protocol}://${req.get("host")}/md/${file}`);
        res.status(404).json({ data: files });
      }
    );

    app.use("/api/v1", require("./routes/api"));

    app.use("*", (req, res) =>
      res
        .status(404)
        .json({ status: false, message: "You hit a wrong route! 🤫" })
    );

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })

  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
