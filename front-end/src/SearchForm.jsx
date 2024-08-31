import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import Book from './Book'; 
import Spinner from 'react-bootstrap/Spinner'; 
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';

const SearchForm = () => {
  const [searchResult, setSearchResult] = useState([]); // Initialize searchResult as an empty array
  const [loading, setLoading] = useState(false); // Add loading state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const searchText = useRef('');
  const navigate = useNavigate();



  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchText.current.value.trim();
    if (query) {
      setLoading(true); // Set loading to true before fetching books
      try {
        const apiURL = `${import.meta.env.VITE_API_URL}/search-books?query=${encodeURIComponent(query)}`;

        const response = await axios.get(apiURL);
        const responseData = response.data;
        setSearchResult(responseData);
         } catch (error) {
        console.error('Error fetching books:', error.message);
        setErrorMessage('Failed to fetch books. Please try again.'); // Set error message
        setSearchResult([]); // Set searchResult to an empty array in case of error
      } finally {
        setLoading(false); // Set loading to false after fetching books (successful or not)
      }
    } else {
      console.warn('Empty search query');
      setSearchResult([]); // Set searchResult to an empty array for empty search query
    }
  };

  const handleAddBook = async (book) => {
    try {
      const { title, author, cover_i } = book; // Extract necessary book information
      const user_id = localStorage.getItem('sessionToken'); // Assuming user_id is stored in localStorage
      const apiURL = `${import.meta.env.VITE_API_URL}/save-book`;

      const response = await axios.post( apiURL, {
        title,
        author,
        cover_i,
        user_id,
      });
  
      if (response.status === 200) {
        setSuccessMessage('Book saved successfully'); // Set success message
        setErrorMessage(''); // Clear any existing error message
        // Optionally, you can reset success message after a certain period
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Reset message after 3 seconds
      } else {
        console.error('Failed to save book');
        setErrorMessage('Failed to save book. Please try again.'); // Set error message
      }
    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage('An error occurred. Please try again.'); // Set error message
    }
  };

  return (
    <div className='search-form'>
      <form className='search-form' onSubmit={handleSearch}>
        <div className='input-group mb-3'>
          <input type="text" className='form-control' placeholder='Search for a book ...' ref={searchText} />
          <button className='btn btn-primary' type="submit">Search</button>
        </div>
      </form>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <div className='search-results'>
          {successMessage && ( // Render success message if it exists
            <div className="alert alert-success">{successMessage}</div>
          )}
          {errorMessage && ( // Render error message if it exists
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <h2 className="mb-3">Search Results</h2>
          <div className="row">
            {searchResult.map((book, index) => (
              <div key={index} className="col-md-3 mb-4">
                <Book book={book} onAdd={handleAddBook} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;