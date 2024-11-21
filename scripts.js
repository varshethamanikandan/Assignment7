const apiUrl = "https://premaderecipe.free.beeceptor.com"; // Replace with your Beeceptor URL



// Function to fetch recipes from Beeceptor or fallback to local storage
function fetchRecipes() {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Beeceptor fetch failed");
      }
      return response.json();
    })
    .then((data) => {
      // If Beeceptor returned data, save it to local storage for persistence
      // localStorage.setItem("recipes", JSON.stringify(data));
      console.log({ data });
      displayRecipes(data);
    })
    .catch((error) => {
      console.error(
        "Error fetching from Beeceptor, using local storage:",
        error,
      );
      // Fallback: Load from local storage if Beeceptor is unavailable
      // const localRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
      // displayRecipes(localRecipes);
    });
}

// Function to display recipes on the homepage
function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipes");
  recipeList.innerHTML = ""; // Clear any existing items
  recipes.forEach((recipe) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="recipe.html?id=${recipe.id}">${recipe.name}</a>`;
    recipeList.appendChild(li);
  });
}

// Handle form submission to create a new recipe
function createRecipe(event) {
  event.preventDefault();

  // Collect recipe data from the form inputs
  const name = document.getElementById("recipe-name").value;
  const ingredients = document
    .getElementById("recipe-ingredients")
    .value.split(",");
  const instructions = document.getElementById("recipe-instructions").value;
  const prepTime = document.getElementById("recipe-prep-time").value;
  const cookTime = document.getElementById("recipe-cook-time").value;
  const tags = document.getElementById("recipe-tags").value.split(",");

  const newRecipe = {
    id: Date.now().toString(), // Generate a unique ID
    name,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    tags,
  };

  // Send the new recipe to Beeceptor with a POST request
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRecipe),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Beeceptor post failed");
      }
      return response.json();
    })
    .then((data) => {
      alert("Recipe added successfully!");

      // Update local storage with the new recipe
      const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      recipes.push(newRecipe);
      localStorage.setItem("recipes", JSON.stringify(recipes));

      // Redirect to homepage to see the updated list
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error adding recipe to Beeceptor:", error);

      // Fallback: Directly update local storage if Beeceptor fails
      const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      recipes.push(newRecipe);
      localStorage.setItem("recipes", JSON.stringify(recipes));

      alert("Recipe added locally.");
      window.location.href = "index.html";
    });
}

// Call fetchRecipes() on page load to populate the list
window.onload = function () {
  fetchRecipes();
};
