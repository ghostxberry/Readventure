import React from 'react';

const Book = ({ book, onAdd }) => {
  const { title, author, cover_i } = book; 

  const coverUrl = cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg` : 'https://i.imgur.com/sG1ShSz.gif';

  const handleClick = () => {
    // Call the onAdd function with the book object when the button is clicked
    onAdd(book);
  };

  return (
    <div className="card">
      <img src={coverUrl} className="card-img-top" alt={title} /> 
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">Author: {Array.isArray(author) ? author.join(', ') : author || 'Unknown'}</p> 
        <button className="btn btn-primary" onClick={handleClick}>Add</button> {/* Add onClick event handler */}
      </div>
    </div>
  );
};

export default Book;

