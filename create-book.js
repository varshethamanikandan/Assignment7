const apiUrl = 'https://mybooks-api.free.beeceptor.com';

document.getElementById('create-book-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const newBook = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    publisher: document.getElementById('publisher').value,
    year: Number(document.getElementById('year').value),
    pages: Number(document.getElementById('pages').value)
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBook)
    });
    
    if (response.ok) {
      alert('Book added successfully!');
      window.location.href = 'index.html';
    } else {
      alert('Failed to add book.');
    }
  } catch (error) {
    console.error("Error adding book:", error);
  }
});
