/* Frontend - script.js */

async function fetchCocktails() {
    const ingredient = document.getElementById("ingredient").value.trim();  
  
    if (!ingredient) {
      alert("Please enter an ingredient!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/cocktails?ingredient=${ingredient}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.drinks || data.error) {
        document.getElementById("cocktail-list").innerHTML = "<p>No cocktails found.</p>";
        return;
      }
  
      document.getElementById("cocktail-list").innerHTML = data.drinks
        .map(drink => `
          <div class="bg-white p-4 shadow rounded">
            <img src="${drink.strDrinkThumb}" class="w-full h-40 object-cover rounded">
            <h2 class="mt-2 font-bold">${drink.strDrink}</h2>
          </div>
        `)
        .join("");
    } catch (error) {
      console.error("Error fetching cocktails:", error.message);
      document.getElementById("cocktail-list").innerHTML = "<p>Error fetching data.</p>";
    }
  }
  
  // Listen for "Enter" key in the search bar
  document.getElementById("ingredient").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent page refresh
      fetchCocktails(); // Call the search function
    }
  });
  document.getElementById("toggle-sidebar").addEventListener("click", function() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("-translate-x-full")) {
        sidebar.classList.remove("-translate-x-full");
    } else {
        sidebar.classList.add("-translate-x-full");
    }
});
  // Event listener for creating a custom cocktail
  document.getElementById("custom-cocktail-form").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const name = document.getElementById("custom-name").value.trim();
    const ingredients = document.getElementById("custom-ingredients").value.split(",").map(ing => ing.trim());
    const instructions = document.getElementById("custom-instructions").value.trim();
  
    if (!name || ingredients.length === 0 || !instructions) {
      alert("Please fill out all fields!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/custom-cocktail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ingredients, instructions }),
      });
  
      const result = await response.json();
      alert(result.message || "Cocktail saved!");
  
      fetchCustomCocktails();
    } catch (error) {
      console.error("Error saving cocktail:", error);
    }
  });
  document.getElementById("ingredient").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents form submission if inside a form
        fetchCocktails(); // Calls the existing function when Enter is pressed
    }
});

  // Fetch saved custom cocktails
  async function fetchCustomCocktails() {
    try {
      const response = await fetch("http://localhost:5000/api/custom-cocktails");
      const data = await response.json();
  
      document.getElementById("custom-cocktail-list").innerHTML = data
        .map(cocktail => `
          <div class="bg-white p-4 shadow rounded">
            <h2 class="mt-2 font-bold">${cocktail.name}</h2>
            <p><strong>Ingredients:</strong> ${cocktail.ingredients.join(", ")}</p>
            <p><strong>Instructions:</strong> ${cocktail.instructions}</p>
          </div>
        `)
        .join("");
    } catch (error) {
      console.error("Error fetching custom cocktails:", error);
    }
  }
  
  // Load saved cocktails on page load
  fetchCustomCocktails();
  