const API_URL = 'https://mybooks-api.free.beeceptor.com';

async function fetchBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function displayBooks(books) {
    const bookList = document.getElementById('books');
    bookList.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="book-details.html?id=${book.id}">${book.title}</a>`;
        bookList.appendChild(li);
    });
}

async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(`${API_URL}/books/${bookId}`);
        const book = await response.json();
        displayBookDetails(book);
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

function displayBookDetails(book) {
    const detailsSection = document.getElementById('book-details');
    detailsSection.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Publisher:</strong> ${book.publisher}</p>
        <p><strong>Year:</strong> ${book.year}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
    `;
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

            if (response.ok) {
                alert('Book created successfully!');
                window.location.href = 'index.html';
            } else {
                throw new Error('Failed to create book');
            }
        } catch (error) {
            console.error('Error creating book:', error);
            alert('Failed to create book. Please try again.');
        }
    });
}