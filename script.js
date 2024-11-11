const API_URL = 'https://mybooks-api.free.beeceptor.com';

async function fetchBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        displayError('Failed to fetch books. Please try again later.');
    }
}

function displayBooks(books) {
    const bookList = document.getElementById('books');
    bookList.innerHTML = '';
    if (books && books.length > 0) {
        books.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="book-details.html?id=${book.id}">${book.title || 'Untitled'}</a>`;
            bookList.appendChild(li);
        });
    } else {
        bookList.innerHTML = '<li>No books available</li>';
    }
}

async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(`${API_URL}/books/${bookId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const book = await response.json();
        displayBookDetails(book);
    } catch (error) {
        console.error('Error fetching book details:', error);
        displayError('Failed to fetch book details. Please try again later.');
    }
}

function displayBookDetails(book) {
    const detailsSection = document.getElementById('book-details');
    if (book) {
        detailsSection.innerHTML = `
            <h2>${book.title || 'Untitled'}</h2>
            <p><strong>Author:</strong> ${book.author || 'Unknown'}</p>
            <p><strong>Publisher:</strong> ${book.publisher || 'Unknown'}</p>
            <p><strong>Year:</strong> ${book.year || 'Unknown'}</p>
            <p><strong>Pages:</strong> ${book.pages || 'Unknown'}</p>
        `;
    } else {
        detailsSection.innerHTML = '<p>Book details not available</p>';
    }
}

function setupCreateBookForm() {
    const form = document.getElementById('create-book-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const bookData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert('Book created successfully!');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error creating book:', error);
            displayError(`Failed to create book: ${error.message}. Please try again later.`);
        }
    });
}

function displayError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.insertBefore(errorElement, document.body.firstChild);
}

// Add this function to handle API errors
function handleApiError(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}