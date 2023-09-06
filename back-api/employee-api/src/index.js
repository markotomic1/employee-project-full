const express = require("express");
const cors = require("cors");
const path = require("path");
const winston = require("winston");
require("dotenv").config();
require("./db/connect");
const app = express();
const userRouter = require("../src/routes/user");
const leaveRouter = require("../src/routes/leave");
const { auth } = require("./middleware/auth");
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../", "public");

//logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

//swagger
if (process.env.NODE_ENV == "development") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerDocument = require("./../swagger-docs/walter-docs.json");

  app.use("/app/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));
app.use((req, res, next) => {
  logger.info({
    message: "Request recieved!",
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  });
  next();
});

//routes
app.use("/app/users", userRouter);
app.use("/app/apply", auth, leaveRouter);
app.use((err, req, res, next) => {
  if (err) {
    logger.error(err.message);
    return res.status(500).send();
  }
  res.status(500).sendFile(publicPath + "/error.html");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
