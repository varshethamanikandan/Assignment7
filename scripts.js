const apiUrl = 'https://ownrecipes-api.free.beeceptor.com';



// Fetch and display recipes
function fetchRecipes() {
  fetch(`${apiUrl}/recipes`)
    .then(response => response.json())
    .then(data => displayRecipes(data))
    .catch(error => console.error('Error fetching recipes:', error));
}

// Display recipes on the homepage
function displayRecipes(recipes) {
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = ''; // Clear existing items
  recipes.forEach(recipe => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="recipe.html?id=${recipe.id}">${recipe.name}</a>`;
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
    name,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    tags
  };
  
  fetch(`${apiUrl}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRecipe)
  })
  .then(response => response.json())
  .then(data => {
    alert('Recipe added successfully!');
    // Now add the new recipe directly to the list displayed on the page
    // Display it on the homepage immediately after adding
    const recipeList = document.getElementById('recipe-list');
    const li = document.createElement('li');
    li.innerHTML = `<a href="recipe.html?id=${data.id}">${data.name}</a>`;  // Update this to match how your API returns data
    recipeList.appendChild(li);
    
    // Optionally, reset the form after submission
    document.getElementById('create-recipe-form').reset();
  })
  .catch(error => console.error('Error creating recipe:', error));
}

// Call fetchRecipes() to populate the list when the page loads
window.onload = function() {
  fetchRecipes();
};