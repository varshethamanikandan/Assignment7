const apiUrl = 'https://recipeown.free.beeceptor.com/recipe'; // Corrected endpoint

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
      const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      displayRecipes(localRecipes);
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
