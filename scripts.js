const apiUrl = "https://premaderecipe.free.beeceptor.com"; // Replace with your Beeceptor URL



// Load all recipes on the homepage
if (document.body.id === 'index') {
    fetch(`${API_URL}`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('recipe-list');
            data.slice(0, 10).forEach(recipe => {
                const item = document.createElement('div');
                item.innerHTML = `
                    <h3>${recipe.title}</h3>
                    <button onclick="viewRecipe(${recipe.id})">View Details</button>
                `;
                list.appendChild(item);
            });
        });
}

// View a single recipe
function viewRecipe(id) {
    location.href = `item.html?id=${id}`;
}

// Load recipe details on item.html
if (document.body.id === 'item') {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(recipe => {
            const details = document.getElementById('recipe-details');
            details.innerHTML = `
                <h2>${recipe.title}</h2>
                <p>${recipe.body}</p>
            `;
        });
}

// Create a new recipe
if (document.body.id === 'create') {
    const form = document.getElementById('create-recipe-form');
    form.addEventListener('submit', event => {
        event.preventDefault();
        const newRecipe = {
            title: form.name.value,
            body: form.steps.value
        };
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecipe)
        })
            .then(response => response.json())
            .then(data => {
                alert('Recipe Created!');
                location.href = 'index.html';
            });
    });
}
