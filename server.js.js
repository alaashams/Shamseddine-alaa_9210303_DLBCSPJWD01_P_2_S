/*
Cedars to Cocktails - Development Phase
This project consists of a web application that allows users to filter cocktail recipes by ingredients and create their own custom recipes.
Frontend: HTML, CSS (Tailwind), JavaScript
Backend: Node.js, Express.js
Database: MongoDB
External API: CocktailDB API
*/

// Backend - server.js (Node.js & Express)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Cedars to Cocktails API!");
});

// MongoDB Connection with Error Handling
mongoose.connect("mongodb://localhost:27017/cocktails", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define Cocktail Schema
const cocktailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  image: { type: String, default: "" },
});
const Cocktail = mongoose.model("Cocktail", cocktailSchema);

// Fetch Cocktails from External API
app.get("/api/cocktails", async (req, res) => {
  try {
    const { ingredient } = req.query;

    if (!ingredient) {
      return res.status(400).json({ error: "Ingredient is required!" });
    }

    console.log(`🔍 Fetching cocktails for ingredient: ${ingredient}`);

    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );

    if (!response.data.drinks) {
      return res.status(404).json({ error: "No drinks found for this ingredient." });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Save Custom Cocktail
app.post("/api/custom-cocktail", async (req, res) => {
  try {
    const { name, ingredients, instructions, image } = req.body;

    if (!name || !ingredients || !instructions) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newCocktail = new Cocktail({ name, ingredients, instructions, image });
    await newCocktail.save();
    res.status(201).json({ message: "Recipe saved successfully!" });
  } catch (error) {
    console.error("Error saving cocktail:", error.message);
    res.status(500).json({ error: "Error saving recipe" });
  }
});

// Fetch Custom Cocktails
app.get("/api/custom-cocktails", async (req, res) => {
  try {
    const cocktails = await Cocktail.find();
    res.json(cocktails);
  } catch (error) {
    console.error("Error fetching custom cocktails:", error.message);
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
