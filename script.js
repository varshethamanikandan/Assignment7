// const API_URL = 'https://myrecipes-api.free.beeceptor.com';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('create-recipe-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent default form submission (page reload)

        // Gather the form data
        const newRecipe = {
            title: document.getElementById('title').value,
            chef: document.getElementById('chef').value,
            cuisine: document.getElementById('cuisine').value,
            prepTime: document.getElementById('prepTime').value,
            cookTime: document.getElementById('cookTime').value,
            ingredients: document.getElementById('ingredients').value.split(','),
            instructions: document.getElementById('instructions').value.split('\n'),
            servings: document.getElementById('servings').value,
            difficulty: document.getElementById('difficulty').value
        };

        // Send the new recipe to the API via POST request
        fetch('https://myyrecipes-api.free.beeceptor.com', {  // Replace with your API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecipe)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Recipe added successfully:', data);
            // Optionally redirect to the homepage to show the new recipe
            window.location.href = 'index.html';  // Redirect to the homepage
        })
        .catch(error => {
            console.error('Error adding recipe:', error);
            alert('There was an error adding the recipe.');
        });
    });
});