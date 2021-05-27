// Required Dependencies
const express = require("express");
const cors = require("cors");

// Create instance of Express server
const app = express();

// Midlleware
app.use(cors());
app.use("/", router);

// Define the port
const port = 3000;

// Run the server
app.listen(port, () => console.log(`Listening on port: ${port}.`));
