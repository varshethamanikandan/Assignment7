const apiUrl = 'https://ownrecipes-api.free.beeceptor.com';

// Fetch all recipes and display on homepage
function fetchRecipes() {
    fetch(`${apiUrl}/recipes`)
      .then(response => response.json())
      .then(data => {
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = ''; // Clear existing items
        data.forEach(recipe => {
          const li = document.createElement('li');
          li.innerHTML =`<a href="recipe.html?id=${recipe.id}">${recipe.name}</a>`;
          recipeList.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching recipes:', error));
  }

// Fetch recipe details and display on detail page
function fetchRecipeDetails(id) {
  fetch(`${apiUrl}/recipes/${id}`)
    .then(response => response.json())
    .then(recipe => {
      const detail = document.getElementById('recipe-detail');
      detail.innerHTML = `
        <h2>${recipe.name}</h2>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
        <p><strong>Cook Time:</strong> ${recipe.cookTime}</p>
        <p><strong>Tags:</strong> ${recipe.tags.join(', ')}</p>
      `;
    })
    .catch(error => console.error('Error fetching recipe details:', error));
}

// Handle form submission to create a new recipe
document.getElementById('create-recipe-form')?.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const recipeData = {
    name: formData.get('name'),
    ingredients: formData.get('ingredients').split(',').map(ing => ing.trim()),
    instructions: formData.get('instructions'),
    prepTime: formData.get('prepTime'),
    cookTime: formData.get('cookTime'),
    tags: formData.get('tags').split(',').map(tag => tag.trim())
  };

  fetch(`${apiUrl}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipeData)
  })
    .then(response => response.json())
    .then(data => {
      alert('Recipe created successfully!');
      window.location.href = 'index.html';
    })
    .catch(error => console.error('Error creating recipe:', error));
});
