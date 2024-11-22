const apiUrl = "https://recipeown.free.beeceptor.com/recipe"; // Replace with your Beeceptor URL

// Function to fetch recipes
function fetchRecipes() {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Beeceptor fetch failed");
      return response.json();
    })
    .then((data) => {
      console.log({ data });
      localStorage.setItem("recipes", JSON.stringify(data)); // Save for fallback
      displayRecipes(data);
    })
    .catch((error) => {
      console.error("Error fetching from Beeceptor, using local storage:", error);
      const localRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
      displayRecipes(localRecipes);
    });
}

// Function to display recipes on the homepage
function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = ""; // Clear existing items
  recipes.forEach((recipe) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="recipe.html?id=${recipe.id}">${recipe.name}</a>
      <button onclick="editRecipe('${recipe.id}')">Edit</button>
      <button onclick="deleteRecipe('${recipe.id}')">Delete</button>
    `;
    recipeList.appendChild(li);
  });
}

// Function to handle recipe deletion
function deleteRecipe(recipeId) {
  fetch(`${apiUrl}/${recipeId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete recipe");
      alert("Recipe deleted successfully");
      const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      fetchRecipes(); // Refresh list
    })
    .catch((error) => {
      console.error("Error deleting recipe:", error);
      alert("Could not delete recipe. Please try again.");
    });
}

// Function to fetch recipe details and display them
function fetchRecipeDetails(recipeId) {
  fetch(`${apiUrl}/${recipeId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch recipe details");
      return response.json();
    })
    .then((recipe) => {
      const recipeDetailElement = document.getElementById("recipe-detail");
      recipeDetailElement.innerHTML = `
        <h2>${recipe.name}</h2>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
        <p><strong>Cook Time:</strong> ${recipe.cookTime}</p>
        <p><strong>Tags:</strong> ${recipe.tags.join(", ")}</p>
      `;
    })
    .catch((error) => {
      console.error("Error fetching recipe details:", error);
      alert("Could not fetch recipe details. Please try again.");
    });
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

// Function to handle editing a recipe
function updateRecipe(event) {
  event.preventDefault();
  const recipeId = document.getElementById("recipe-id").value;
  const updatedRecipe = {
    name: document.getElementById("recipe-name").value,
    ingredients: document.getElementById("recipe-ingredients").value.split(","),
    instructions: document.getElementById("recipe-instructions").value,
    prepTime: document.getElementById("recipe-prep-time").value,
    cookTime: document.getElementById("recipe-cook-time").value,
    tags: document.getElementById("recipe-tags").value.split(","),
  };

  fetch(`${apiUrl}/${recipeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedRecipe),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update recipe");
      alert("Recipe updated successfully");

      const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      const index = recipes.findIndex((r) => r.id === recipeId);
      if (index !== -1) {
        recipes[index] = { id: recipeId, ...updatedRecipe };
        localStorage.setItem("recipes", JSON.stringify(recipes));
      }

      window.location.href = `recipe.html?id=${recipeId}`; // Redirect to details page
    })
    .catch((error) => {
      console.error("Error updating recipe:", error);
      alert("Could not update recipe. Please try again.");
    });
}

// Call fetchRecipes on homepage load
window.onload = function () {
  if (document.getElementById("recipe-list")) fetchRecipes();
  if (document.getElementById("recipe-detail")) {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    if (recipeId) fetchRecipeDetails(recipeId);
  }
};
