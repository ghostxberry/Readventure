import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SavedBook from './SavedBook'; 

const ReadingList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/saved-books');
        setBooks(response.data); // Assuming the server returns an array of saved books
      } catch (error) {
        console.error('Error fetching saved books:', error.message);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    try {
      // Get the user ID from local storage or another source
      const userId = localStorage.getItem('sessionToken'); // Example: Retrieve user ID from local storage
      
      // Make HTTP DELETE request to delete the saved book using the id and user ID
      await axios.delete(`http://localhost:5000/api/saved-books/${bookId}`, {
        headers: {
          'X-User-ID': userId, // Include user ID in the request headers
        },
      });

      // After successful deletion, fetch updated book list
      fetchBooks();
    } catch (error) {
      console.error('Error deleting saved book:', error.message);
      // Display error message to the user or handle the error in another appropriate way
    }
  };
  


  return (
    <div>
      <h2>Reading List</h2>
      {books.map((book) => (
        <SavedBook
        key={book.id}
        savedBook={book}
        onDelete={() => handleDelete(book.id)}
      />
      ))}
    </div>
  );
};

export default ReadingList;
