require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("@prisma/client");

const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => console.log("Server running on port 5000"));
