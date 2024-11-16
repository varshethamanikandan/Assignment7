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
    li.innerHTML = `
      <span>${recipe.name}</span>
      <a href="recipe.html?id=${recipe.id}" class="button">View</a>
      <a href="edit.html?id=${recipe.id}" class="button">Edit</a>
      <button onclick="deleteRecipe('${recipe.id}')">Delete</button>
    `;
    recipeList.appendChild(li);
  });
}

// Function to delete a recipe
function deleteRecipe(recipeId) {
  if (confirm('Are you sure you want to delete this recipe?')) {
    fetch(`${apiUrl}/${recipeId}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete recipe. HTTP status: ${response.status}`);
        }
        console.log(`Recipe with ID ${recipeId} deleted.`);
        // Remove from local storage for immediate feedback
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        const updatedRecipes = recipes.filter(r => r.id !== recipeId);
        localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
        fetchRecipes(); // Refresh the list
      })
      .catch(error => console.error('Error deleting recipe:', error));
  }
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

// Function to fetch recipe data and pre-fill the edit form
function fetchRecipeForEdit(recipeId) {
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
  const recipe = recipes.find(r => r.id === recipeId);

  if (recipe) {
    populateEditForm(recipe);
  } else {
    console.error('Recipe not found for editing');
  }
}

// Function to populate the edit form
function populateEditForm(recipe) {
  document.getElementById('recipe-name').value = recipe.name;
  document.getElementById('recipe-ingredients').value = recipe.ingredients.join(', ');
  document.getElementById('recipe-instructions').value = recipe.instructions;
  document.getElementById('recipe-prep-time').value = recipe.prepTime;
  document.getElementById('recipe-cook-time').value = recipe.cookTime;
  document.getElementById('recipe-tags').value = recipe.tags.join(', ');
}

// Function to handle the update submission
function updateRecipe(event, recipeId) {
  event.preventDefault();

  const updatedRecipe = {
    id: recipeId,
    name: document.getElementById('recipe-name').value,
    ingredients: document.getElementById('recipe-ingredients').value.split(',').map(item => item.trim()),
    instructions: document.getElementById('recipe-instructions').value,
    prepTime: document.getElementById('recipe-prep-time').value,
    cookTime: document.getElementById('recipe-cook-time').value,
    tags: document.getElementById('recipe-tags').value.split(',').map(item => item.trim())
  };

  fetch(`${apiUrl}/${recipeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedRecipe)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update recipe. HTTP status: ${response.status}`);
      }
      console.log('Recipe updated:', updatedRecipe);
      alert('Recipe updated successfully!');
      // Update local storage
      const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
      const updatedRecipes = recipes.map(r => (r.id === recipeId ? updatedRecipe : r));
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      window.location.href = 'index.html'; // Redirect to homepage
    })
    .catch(error => console.error('Error updating recipe:', error));
}

// Call appropriate function on page load
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');

  if (document.getElementById('recipes')) {
    fetchRecipes();
  } else if (document.getElementById('recipe-detail')) {
    if (recipeId) fetchRecipeDetails(recipeId);
  } else if (document.getElementById('edit-recipe-form')) {
    if (recipeId) fetchRecipeForEdit(recipeId);
  }
};
