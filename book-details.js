const apiUrl = 'https://mybooks-api.free.beeceptor.com';

async function fetchBookDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');
  
  try {
    const response = await fetch(`${apiUrl}/${bookId}`);
    const book = await response.json();
    
    const bookDetails = document.getElementById('book-details');
    bookDetails.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.author}</p>
      <p>Publisher: ${book.publisher}</p>
      <p>Year: ${book.year}</p>
      <p>Pages: ${book.pages}</p>
    `;
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
}

fetchBookDetails();
