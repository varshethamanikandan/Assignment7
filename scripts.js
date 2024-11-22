const apiUrl = "https://recipeown.free.beeceptor.com/recipe"; // Replace with your Beeceptor URL

// Function to fetch recipes
function fetchRecipes() {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Beeceptor fetch failed");
      return response.json();
    })
    .then((data) => {
      displayRecipes(data);
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
    });
}

// Function to display recipes
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

// Handle recipe deletion
function deleteRecipe(recipeId) {
  fetch(`${apiUrl}/${recipeId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete recipe");
      alert("Recipe deleted successfully");
      fetchRecipes(); // Refresh the list
    })
    .catch((error) => {
      console.error("Error deleting recipe:", error);
    });
}

// Redirect to edit page
function editRecipe(recipeId) {
  window.location.href = `edit-recipe.html?id=${recipeId}`;
}

// Handle recipe update
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRecipe),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update recipe");
      alert("Recipe updated successfully");
      window.location.href = "index.html"; // Redirect to homepage
    })
    .catch((error) => {
      console.error("Error updating recipe:", error);
    });
}

// Fetch and populate recipe data on the Edit page
function fetchRecipeDetails(recipeId) {
  fetch(`${apiUrl}/${recipeId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch recipe details");
      return response.json();
    })
    .then((recipe) => {
      document.getElementById("recipe-id").value = recipe.id;
      document.getElementById("recipe-name").value = recipe.name;
      document.getElementById("recipe-ingredients").value = recipe.ingredients.join(",");
      document.getElementById("recipe-instructions").value = recipe.instructions;
      document.getElementById("recipe-prep-time").value = recipe.prepTime;
      document.getElementById("recipe-cook-time").value = recipe.cookTime;
      document.getElementById("recipe-tags").value = recipe.tags.join(",");
    })
    .catch((error) => {
      console.error("Error fetching recipe details:", error);
    });
}

// Initialize the app
window.onload = function () {
  if (document.getElementById("recipe-list")) fetchRecipes();
};
