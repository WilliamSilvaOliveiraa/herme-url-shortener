const { type, redirect } = require("express/lib/response");
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortID: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timeStamp: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const URL = moongoose.model("URL", urlSchema);

module.exports = URL;
