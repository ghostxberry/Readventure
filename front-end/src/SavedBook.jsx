import React, { useState } from 'react';
import axios from 'axios'; 

const SavedBook = ({ savedBook, onDelete }) => {
  const { id, title, author, cover_i, reading_goal, reading_frequency } = savedBook;
  const [goal, setGoal] = useState(reading_goal);
  const [frequency, setFrequency] = useState(reading_frequency);

  const handleGoalChange = (event) => {
    setGoal(event.target.value);
  };

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };

  const handleUpdate = () => {
    // TO DO
  };

  const handleDeleteClick = () => {
    onDelete(id); //TO DO
  };
  // Generate cover URL
  const coverUrl = cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg` : 'https://i.imgur.com/sG1ShSz.gif';

  return (
    <div className="card">
      <img src={coverUrl} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">Author: {author}</p>
        <div className="form-group">
          <label htmlFor="goal">Chapters:</label>
          <input
            type="number"
            className="form-control"
            id="goal"
            value={goal}
            onChange={handleGoalChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="frequency">Per:</label>
          <select
            className="form-control"
            id="frequency"
            value={frequency}
            onChange={handleFrequencyChange}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
          </select>
        </div>
        <button onClick={handleUpdate} className="btn btn-primary mr-2">
          Update
        </button>
        <button onClick={handleDeleteClick} className="btn btn-danger">
          Delete
        </button>

      </div>
    </div>
  );
};

export default SavedBook;
