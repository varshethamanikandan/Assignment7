const API_URL = 'https://myrecipes-api.free.beeceptor.com';

async function fetchRecipes() {
    try {
        const response = await fetch(`${API_URL}/recipes`);
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipes');
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="recipe-details.html?id=${recipe.id}">${recipe.title}</a>`;
        recipeList.appendChild(li);
    });
}

async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(`${API_URL}/recipes/${recipeId}`);
        const recipe = await response.json();
        displayRecipeDetails(recipe);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function displayRecipeDetails(recipe) {
    const detailsSection = document.getElementById('recipe-details');
    detailsSection.innerHTML = `
        <h2>${recipe.title}</h2>
        <p><strong>Chef:</strong> ${recipe.chef}</p>
        <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
        <p><strong>Preparation Time:</strong> ${recipe.prepTime} minutes</p>
        <p><strong>Cooking Time:</strong> ${recipe.cookTime} minutes</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
        <h3>Ingredients:</h3>
        <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
        <h3>Instructions:</h3>
        <ol>${recipe.instructions.map(step => `<li>${step}</li>`).join('')}</ol>
        <h3>Nutritional Information:</h3>
        <p>Calories: ${recipe.nutritionalInfo.calories}, Protein: ${recipe.nutritionalInfo.protein}g, Carbs: ${recipe.nutritionalInfo.carbs}g, Fat: ${recipe.nutritionalInfo.fat}g</p>
    `;
}

function setupCreateRecipeForm() {
    const form = document.getElementById('create-recipe-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const recipeData = Object.fromEntries(formData.entries());
        
        // Process ingredients and instructions
        recipeData.ingredients = recipeData.ingredients.split(',').map(item => item.trim());
        recipeData.instructions = recipeData.instructions.split('\n').map(item => item.trim());

        try {
            const response = await fetch(`${API_URL}/recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData),
            });

            if (response.ok) {
                alert('Recipe added successfully!');
                window.location.href = 'index.html';
            } else {
                throw new Error('Failed to add recipe');
            }
        } catch (error) {
            console.error('Error adding recipe:', error);
            alert('Failed to add recipe. Please try again.');
        }
    });
}