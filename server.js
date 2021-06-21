// Required Dependencies
const express = require("express");
const cors = require("cors");
const router = require("./routes");

// Create instance of Express server
const app = express();

// Midlleware
app.use(cors());
app.use("/", router);

// Define the port
const port = process.env.PORT || 3000;

// Run the server
app.listen(port, () => console.log(`Listening on port: ${port}.`));
