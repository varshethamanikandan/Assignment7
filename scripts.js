const apiUrl = 'https://recipeown.free.beeceptor.com/recipe'; // Replace with your Beeceptor URL

// Fetch recipes
function fetchRecipes() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('recipes', JSON.stringify(data));
      displayRecipes(data);
    })
    .catch(() => {
      const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      displayRecipes(localRecipes);
    });
}

// Display list of recipes
function displayRecipes(recipes) {
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = '';
  recipes.forEach(recipe => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="recipe.html?id=${recipe.id}">${recipe.name}</a>`;
    recipeList.appendChild(li);
  });
}

// Create a new recipe
function createRecipe(event) {
  event.preventDefault();
  
  const name = document.getElementById('recipe-name').value;
  const ingredients = document.getElementById('recipe-ingredients').value.split(',');
  const instructions = document.getElementById('recipe-instructions').value;
  const prepTime = document.getElementById('recipe-prep-time').value;
  const cookTime = document.getElementById('recipe-cook-time').value;
  const tags = document.getElementById('recipe-tags').value.split(',');

  const newRecipe = {
    id: Date.now().toString(),
    name,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    tags
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRecipe)
  })
  .then(response => response.json())
  .then(() => {
    alert('Recipe added successfully!');
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    window.location.href = 'index.html';
  })
  .catch(() => {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    alert('Recipe added locally.');
    window.location.href = 'index.html';
  });
}

// Fetch recipe details
function fetchRecipeDetails(recipeId) {
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
  const recipe = recipes.find(r => r.id === recipeId);

  if (recipe) {
    document.getElementById('recipe-detail').innerHTML = `
      <h2>${recipe.name}</h2>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
      <p><strong>Instructions:</strong> ${recipe.instructions}</p>
      <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
      <p><strong>Cook Time:</strong> ${recipe.cookTime}</p>
      <p><strong>Tags:</strong> ${recipe.tags.join(', ')}</p>
    `;
  }
}

window.onload = function() {
  fetchRecipes();
};
