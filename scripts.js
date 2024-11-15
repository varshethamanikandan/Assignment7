const apiUrl = 'https://recipesown.free.beeceptor.com'; // Replace with your Beeceptor URL

// Function to fetch recipes from Beeceptor or fallback to local storage
function fetchRecipes() {
  fetch(apiUrl)
    .then(response => {
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); // Get the response as text first
    })
    .then(text => {
      console.log('Raw response:', text); // Log the raw response
      try {
        // Try to parse the text as JSON
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
        // If successful, save to local storage and display
        localStorage.setItem('recipes', JSON.stringify(data));
        displayRecipes(data);
      } catch (error) {
        console.error('Error parsing Beeceptor response:', error);
        console.log('Response content:', text);
        throw new Error('Invalid JSON response from Beeceptor');
      }
    })
    .catch(error => {
      console.error('Error fetching from Beeceptor:', error);
      // Fallback: Load from local storage if Beeceptor is unavailable or returns invalid data
      const localRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      displayRecipes(localRecipes);
    });
}

// Function to display recipes on the homepage
function displayRecipes(recipes) {
  const recipeList = document.getElementById('recipe-list');
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

// Handle form submission to create a new recipe
function createRecipe(event) {
  event.preventDefault();
  
  // Collect recipe data from the form inputs
  const name = document.getElementById('recipe-name').value;
  const ingredients = document.getElementById('recipe-ingredients').value.split(',').map(item => item.trim());
  const instructions = document.getElementById('recipe-instructions').value;
  const prepTime = document.getElementById('recipe-prep-time').value;
  const cookTime = document.getElementById('recipe-cook-time').value;
  const tags = document.getElementById('recipe-tags').value.split(',').map(item => item.trim());

  const newRecipe = {
    id: Date.now().toString(), // Generate a unique ID
    name,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    tags
  };

  // Send the new recipe to Beeceptor with a POST request
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRecipe)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Beeceptor post failed');
    }
    return response.json();
  })
  .then(data => {
    console.log('Recipe added to Beeceptor:', data);
    alert('Recipe added successfully!');

    // Update local storage with the new recipe
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Redirect to homepage to see the updated list
    window.location.href = 'index.html';
  })
  .catch(error => {
    console.error('Error adding recipe to Beeceptor:', error);

    // Fallback: Directly update local storage if Beeceptor fails
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    
    alert('Recipe added locally.');
    window.location.href = 'index.html';
  });
}

// Function to fetch recipe details
function fetchRecipeDetails(recipeId) {
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
  const recipe = recipes.find(r => r.id === recipeId);
  
  if (recipe) {
    displayRecipeDetails(recipe);
  } else {
    console.error('Recipe not found');
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
  if (document.getElementById('recipe-list')) {
    fetchRecipes();
  } else if (document.getElementById('recipe-detail')) {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    if (recipeId) {
      fetchRecipeDetails(recipeId);
    }
  }
};