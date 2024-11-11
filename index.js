const apiUrl = 'https://mybooks-api.free.beeceptor.com';

async function fetchBooks() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const bookList = document.getElementById('book-list');
    data.books.forEach(book => {
      const bookItem = document.createElement('div');
      bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <button onclick="viewBook(${book.id})">View Details</button>
      `;
      bookList.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function viewBook(bookId) {
  window.location.href = `book-details.html?id=${bookId}`;
}

fetchBooks();
