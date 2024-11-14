const API_URL = 'https://mymovies-api.free.beeceptor.com';

async function fetchMovies() {
    try {
        const response = await fetch(`${API_URL}/movies`);
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movies');
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="movie-details.html?id=${movie.id}">${movie.title}</a>`;
        movieList.appendChild(li);
    });
}

async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_URL}/movies/${movieId}`);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function displayMovieDetails(movie) {
    const detailsSection = document.getElementById('movie-details');
    detailsSection.innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Director:</strong> ${movie.director}</p>
        <p><strong>Year:</strong> ${movie.year}</p>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p><strong>Duration:</strong> ${movie.duration} minutes</p>
    `;
}

function setupCreateMovieForm() {
    const form = document.getElementById('create-movie-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const movieData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData),
            });

            if (response.ok) {
                alert('Movie added successfully!');
                window.location.href = 'index.html';
            } else {
                throw new Error('Failed to add movie');
            }
        } catch (error) {
            console.error('Error adding movie:', error);
            alert('Failed to add movie. Please try again.');
        }
    });
}