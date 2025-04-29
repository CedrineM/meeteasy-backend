//importation des packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//création du serveur express
const app = express();

//connexion à la base de donnée
mongoose.connect(process.env.MONGODB_LOCAL_URI);

//route d'entré du serveur
app.get("/", (req, res) => {
  return res.status(200).json({
    message:
      "Welcome to the web application to facilitate the writing of meeting minutes.",
  });
});

//toutes les routes non existantes
app.use((req, res) => {
  return res.status(404).json({ message: "Error 404, Page not Found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
