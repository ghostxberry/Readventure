import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = () => {
  return (
    <div className="text-center mt-3">
      <Spinner animation="border" variant="secondary" />
    </div>
  );
};

export default LoadingSpinner;
