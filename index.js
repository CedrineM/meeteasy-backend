//importation des packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//création du serveur express
const app = express();
app.use(express.json());

//connexion à la base de donnée
mongoose.connect(process.env.MONGODB_LOCAL_URI);

//route d'entré du serveur
app.get("/", (req, res) => {
  return res.status(200).json({
    message:
      "Welcome to the web application to facilitate the writing of meeting minutes.",
  });
});

// import des routes
const userRoutes = require("./routes/user");
app.use(userRoutes);
const noteRoutes = require("./routes/note");
app.use(noteRoutes);

//toutes les routes non existantes
app.use((req, res) => {
  return res.status(404).json({ message: "Error 404, Page not Found" });
});

const server = app.listen(process.env.PORT, () => {
  console.log("Server Started");
});

// Exporter l'app pour pouvoir l'utiliser dans les tests
module.exports = server; // C'est ce qui va permettre à Supertest de l'utiliser
