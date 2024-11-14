function loadRecipesFromLocalStorage() {
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
  displayRecipes(recipes);
}

// Function to save a new recipe to local storage
function saveRecipeToLocalStorage(recipe) {
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
  recipes.push(recipe);
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Display recipes on the homepage
function displayRecipes(recipes) {
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = ''; // Clear existing items
  recipes.forEach(recipe => {
    const li = document.createElement('li');
    li.innerHTML =` <a href="recipe.html?id=${recipe.id}">${recipe.name}</a>`;
    recipeList.appendChild(li);
  });
}

// Handle form submission for creating a new recipe
function createRecipe(event) {
  event.preventDefault();
  
  // Get recipe data from form inputs
  const name = document.getElementById('recipe-name').value;
  const ingredients = document.getElementById('recipe-ingredients').value.split(',');
  const instructions = document.getElementById('recipe-instructions').value;
  const prepTime = document.getElementById('recipe-prep-time').value;
  const cookTime = document.getElementById('recipe-cook-time').value;
  const tags = document.getElementById('recipe-tags').value.split(',');

  const newRecipe = {
    id: Date.now().toString(), // Unique ID for each recipe
    name,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    tags
  };

  // Save the new recipe to local storage
  saveRecipeToLocalStorage(newRecipe);

  // Directly add the new recipe to the list displayed on the homepage
  const recipeList = document.getElementById('recipe-list');
  const li = document.createElement('li');
  li.innerHTML = `<a href="recipe.html?id=${newRecipe.id}">${newRecipe.name}</a>`;
  recipeList.appendChild(li);

  alert('Recipe added successfully!');
  
  // Optionally, reset the form after submission
  document.getElementById('create-recipe-form').reset();
}

// Call loadRecipesFromLocalStorage() to populate the list when the page loads
window.onload = function() {
  loadRecipesFromLocalStorage();
};