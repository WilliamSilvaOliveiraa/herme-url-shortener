const express = require("express");
const connectMongoDB = require("./connect");
const urlRouter = require("./routes/url");
const app = express();
const URL = require("./models/url");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
// const MONGO_URI = "mongodb://mongo:27017/hermedb";
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;

app.use(express.json());

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOne({ shortId });

    if (entry) {
      URL.updateOne(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } }
      ).exec();

      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("Short URL not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-api-key"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
  next();
});

connectMongoDB(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/url", urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
