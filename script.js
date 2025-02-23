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
// Toggle sidebar visibility
document.getElementById('toggle-sidebar').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('-translate-x-full');
});
document.getElementById('close-sidebar').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.add('-translate-x-full');
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
  // Search button functionality
document.getElementById('search-button').addEventListener('click', function() {
  var query = document.getElementById('search-input').value;
  var resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = ''; // Clear previous results

  // Fetch search results from TheCocktailDB API
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
    .then(response => response.json())
    .then(data => {
      if (data.drinks) {
        data.drinks.forEach(drink => {
          var resultDiv = document.createElement('div');
          resultDiv.classList.add('p-4', 'bg-white', 'rounded', 'shadow-md', 'mb-4', 'relative', 'search-result');
          resultDiv.innerHTML = `
            <div class="cursor-pointer" onclick="showModal(${JSON.stringify(drink).replace(/"/g, '&quot;')})">
              <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="w-full object-cover rounded mb-4">
              <h3 class="text-xl font-bold">${drink.strDrink}</h3>
            </div>
            <button class="save-cocktail-button text-white p-2 rounded w-full mt-2" onclick="event.stopPropagation(); saveCocktail('${drink.idDrink}')">Save Cocktail</button>
          `;
          resultsContainer.appendChild(resultDiv);
        });
      } else {
        resultsContainer.innerHTML = '<p class="text-red-600">No results found</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
      resultsContainer.innerHTML = '<p class="text-red-600">Error fetching search results</p>';
    });
});

