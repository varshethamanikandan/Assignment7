
const apiUrl = 'https://premaderecipe.free.beeceptor.com/recipe'; // Beeceptor endpoint

// Function to fetch recipes from Beeceptor or fallback to local storage
function fetchRecipes() {
  fetch(apiUrl)
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then(data => {
      console.log('Fetched recipes:', data);
      // Save to local storage for fallback use
      localStorage.setItem('recipes', JSON.stringify(data));
      // Display recipes
      displayRecipes(data);
    })
    .catch(error => {
      console.error('Error fetching recipes:', error);
      // Fallback: Load from local storage if Beeceptor is unavailable
      const fallbackRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      displayRecipes(fallbackRecipes);
    });
}

// Function to display recipes on the homepage
function displayRecipes(recipes) {
  const recipeList = document.getElementById('recipes'); // Corrected ID
  if (!recipeList) {
    console.error('Recipe list element not found');
    return;
  }
  recipeList.innerHTML = ''; // Clear any existing items
  recipes.forEach(recipe => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="recipe.html?id=${recipe.id}">${recipe.name}</a>`;
    recipeList.appendChild(li);
  });
}

// Function to fetch and display recipe details
function fetchRecipeDetails(recipeId) {
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
  const recipe = recipes.find(r => r.id === recipeId);

  if (recipe) {
    displayRecipeDetails(recipe);
  } else {
    console.error('Recipe not found in local storage');
    document.getElementById('recipe-detail').innerHTML = '<p>Recipe not found</p>';
  }
}

// Function to display recipe details
function displayRecipeDetails(recipe) {
  const detailElement = document.getElementById('recipe-detail');
  if (!detailElement) {
    console.error('Recipe detail element not found');
    return;
  }

  detailElement.innerHTML = `
    <h2>${recipe.name}</h2>
    <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
    <p><strong>Cook Time:</strong> ${recipe.cookTime}</p>
    <h3>Ingredients:</h3>
    <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
    <h3>Instructions:</h3>
    <p>${recipe.instructions}</p>
    <p><strong>Tags:</strong> ${recipe.tags.join(', ')}</p>
  `;
}

// Simulate Beeceptor response for local testing
const mockRecipes = [
  { "id": "1", "name": "Mock Spaghetti", "prepTime": "10 mins", "cookTime": "20 mins", "ingredients": ["spaghetti", "sauce"], "instructions": "Cook spaghetti", "tags": ["Italian"] },
  { "id": "2", "name": "Mock Tacos", "prepTime": "5 mins", "cookTime": "15 mins", "ingredients": ["tortilla", "meat"], "instructions": "Prepare tacos", "tags": ["Mexican"] },
  { "id": "3", "name": "Mock Salad", "prepTime": "5 mins", "cookTime": "0 mins", "ingredients": ["lettuce", "tomatoes", "cucumber"], "instructions": "Mix ingredients", "tags": ["Healthy"] },
  { "id": "4", "name": "Mock Pizza", "prepTime": "15 mins", "cookTime": "25 mins", "ingredients": ["dough", "cheese", "sauce"], "instructions": "Bake pizza", "tags": ["Italian", "Fast"] },
  { "id": "5", "name": "Mock Pancakes", "prepTime": "10 mins", "cookTime": "10 mins", "ingredients": ["flour", "eggs", "milk"], "instructions": "Cook pancakes", "tags": ["Breakfast"] },
  { "id": "6", "name": "Mock Curry", "prepTime": "15 mins", "cookTime": "30 mins", "ingredients": ["spices", "chicken", "onion"], "instructions": "Cook curry", "tags": ["Indian"] },
  { "id": "7", "name": "Mock Burger", "prepTime": "10 mins", "cookTime": "15 mins", "ingredients": ["buns", "meat", "lettuce"], "instructions": "Assemble burger", "tags": ["Fast Food"] },
  { "id": "8", "name": "Mock Soup", "prepTime": "10 mins", "cookTime": "20 mins", "ingredients": ["broth", "vegetables"], "instructions": "Boil soup", "tags": ["Healthy"] },
  { "id": "9", "name": "Mock Sushi", "prepTime": "20 mins", "cookTime": "0 mins", "ingredients": ["rice", "fish"], "instructions": "Roll sushi", "tags": ["Japanese"] },
  { "id": "10", "name": "Mock Cake", "prepTime": "20 mins", "cookTime": "40 mins", "ingredients": ["flour", "sugar", "eggs"], "instructions": "Bake cake", "tags": ["Dessert"] }
];
localStorage.setItem('recipes', JSON.stringify(mockRecipes));

// Call appropriate function on page load
window.onload = function() {
  if (document.getElementById('recipes')) {
    fetchRecipes();
  } else if (document.getElementById('recipe-detail')) {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    if (recipeId) {
      fetchRecipeDetails(recipeId);
    }
  }
};
