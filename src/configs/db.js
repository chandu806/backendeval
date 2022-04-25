const express = require("express");
const mongoose = require("mongoose");
const { reset } = require("nodemon");

const app = express();

app.use(express.json());
