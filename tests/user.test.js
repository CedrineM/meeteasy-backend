//test de la route GET/user et user/signup

//import
const request = require("supertest");
const server = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");

describe("User Routes", () => {
  let token;

  beforeAll(async () => {
    //Vérification de l'existance user
    const existingUser = await User.findOne({ email: "test@example.com" });

    if (!existingUser) {
      // Créer un utilisateur de test
      const response = await request(server).post("/user/signup").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        confirmePassword: "password123",
      });

      //   console.log("Signup response:", response.body); // 👈 pour debug
      token = response.body[1].token; // Récupération du token à utiliser dans les tests
      //   console.log(token);
    } else {
      //user existe deja
      const response = await request(server)
        .post("/user/login")
        .send({ email: "test@example.com", password: "password123" });
      token = response.body.token; // Récupération du token à utiliser dans les tests
    }
  });

  it("should return user data if token is valid", async () => {
    const response = await request(server)
      .get("/user")
      .set("Authorization", `Bearer ${token}`); // Passage du token ici

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("email");
  });
});

afterAll(async () => {
  // Cela va fermer la connexion mongoose après les tests
  await mongoose.connection.close();
  server.close(); // Arrêter le serveur après tous les tests
});
