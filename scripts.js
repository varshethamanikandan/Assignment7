const apiUrl = "https://recipeall.free.beeceptor.com/recipe"; // Replace with your Beeceptor URL

// Regular Expression for alphabetic input (only letters, spaces, and commas allowed)
const alphaRegex = /^[A-Za-z\s,]+$/;

// Function to fetch recipes
function fetchRecipes() {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  console.log("Fetched recipes from localStorage:", recipes); // Debugging log
  displayRecipes(recipes);
}

// Function to display recipes on the homepage
function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = ""; // Clear existing items
  console.log("Displaying recipes:", recipes); // Debugging log
  recipes.forEach((recipe) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span onclick="viewRecipeDetails('${recipe.id}')" style="cursor: pointer; text-decoration: underline; color: blue;">
        ${recipe.name}
      </span>
      <button onclick="editRecipe('${recipe.id}')">Edit</button>
      <button onclick="deleteRecipe('${recipe.id}')">Delete</button>
    `;
    recipeList.appendChild(li);
  });
}

// Function to view recipe details
function viewRecipeDetails(recipeId) {
  window.location.href = `recipe.html?id=${recipeId}`;
}

// Function to handle recipe deletion
function deleteRecipe(recipeId) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
  localStorage.setItem("recipes", JSON.stringify(updatedRecipes));

  alert("Recipe deleted successfully");
  displayRecipes(updatedRecipes); // Refresh the home page
}

// Function to pre-fill form for editing
function editRecipe(recipeId) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const recipe = recipes.find((r) => r.id === recipeId);
  if (!recipe) {
    alert("Recipe not found.");
    return;
  }
  window.location.href = `edit-recipe.html?id=${recipeId}`;
}

// Function to add a new recipe
function addRecipe(event) {
  event.preventDefault();

  // Get input values
  const recipeName = document.getElementById("recipe-name").value;
  const ingredients = document.getElementById("recipe-ingredients").value;
  const instructions = document.getElementById("recipe-instructions").value;
  const tags = document.getElementById("recipe-tags").value;

  // Validate input fields with regular expressions
  if (!alphaRegex.test(recipeName)) {
    alert("Recipe name can only contain alphabets, spaces, and commas.");
    return;
  }
  if (!alphaRegex.test(ingredients)) {
    alert("Ingredients can only contain alphabets, spaces, and commas.");
    return;
  }
  if (!alphaRegex.test(instructions)) {
    alert("Instructions can only contain alphabets and spaces.");
    return;
  }
  if (!alphaRegex.test(tags)) {
    alert("Tags can only contain alphabets, spaces, and commas.");
    return;
  }

  const newRecipe = {
    id: Date.now().toString(), // Unique ID for the recipe
    name: recipeName,
    ingredients: ingredients.split(","),
    instructions: instructions,
    prepTime: document.getElementById("recipe-prep-time").value,
    cookTime: document.getElementById("recipe-cook-time").value,
    tags: tags.split(","),
  };

  // Save to localStorage
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  recipes.push(newRecipe);
  localStorage.setItem("recipes", JSON.stringify(recipes));

  console.log("New Recipe Added:", newRecipe); // Debugging log
  console.log("All Recipes:", recipes); // Debugging log

  // Show success message
  const successMessage = document.getElementById("success-message");
  successMessage.innerHTML = "Recipe successfully added!";
  successMessage.style.display = "block";

  // Optionally, hide the success message after 3 seconds
  setTimeout(() => {
    successMessage.style.display = "none";
    window.location.href = "index.html"; // Redirect to home page
  }, 3000); // 3 seconds delay
}

// Function to fetch recipe details
function fetchRecipeDetails(recipeId) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const recipe = recipes.find((r) => r.id === recipeId);

  if (recipe) {
    displayRecipeDetails(recipe);
  } else {
    alert("Recipe not found!");
  }
}

// Function to display recipe details
function displayRecipeDetails(recipe) {
  document.getElementById("recipe-detail").innerHTML = `
    <h2>${recipe.name}</h2>
    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
    <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
    <p><strong>Cook Time:</strong> ${recipe.cookTime}</p>
    <p><strong>Tags:</strong> ${recipe.tags.join(", ")}</p>
  `;
}

// Function to handle editing a recipe
function updateRecipe(event) {
  event.preventDefault();
  const recipeId = document.getElementById("recipe-id").value;
  const updatedRecipe = {
    id: recipeId,
    name: document.getElementById("recipe-name").value,
    ingredients: document.getElementById("recipe-ingredients").value.split(","),
    instructions: document.getElementById("recipe-instructions").value,
    prepTime: document.getElementById("recipe-prep-time").value,
    cookTime: document.getElementById("recipe-cook-time").value,
    tags: document.getElementById("recipe-tags").value.split(","),
  };

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const index = recipes.findIndex((r) => r.id === recipeId);
  if (index !== -1) {
    recipes[index] = updatedRecipe;
    localStorage.setItem("recipes", JSON.stringify(recipes));

    alert("Recipe updated successfully!");
    window.location.href = `recipe.html?id=${recipeId}`;
  } else {
    alert("Recipe not found!");
  }
}

// Call fetchRecipes on homepage load
window.onload = function () {
  if (document.getElementById("recipe-list")) fetchRecipes();
};
