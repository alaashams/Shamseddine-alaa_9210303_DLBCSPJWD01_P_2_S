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

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/cocktails");


// Define Cocktail Schema
const cocktailSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  instructions: String,
  image: String,
});
const Cocktail = mongoose.model("Cocktail", cocktailSchema);

// Fetch Recipes from CocktailDB API
app.get("/api/cocktails", async (req, res) => {
  try {
    const { ingredient } = req.query;
    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Save Custom Recipe
app.post("/api/custom-cocktail", async (req, res) => {
  try {
    const newCocktail = new Cocktail(req.body);
    await newCocktail.save();
    res.status(201).json({ message: "Recipe saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving recipe" });
  }
});

// Get Custom Recipes
app.get("/api/custom-cocktails", async (req, res) => {
  try {
    const cocktails = await Cocktail.find();
    res.json(cocktails);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});