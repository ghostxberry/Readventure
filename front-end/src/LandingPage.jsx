import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Button from 'react-bootstrap/Button'
import NavBar from './NavBar'
import {Link} from "react-router-dom";

const LandingPage = () => {
  return (
    
    <div className="hero-container">
       

      <h1>Readventure</h1>
      <p>Plan your reading goals!</p>
     <p><Button variant="outline-primary"> <Link to="/search">Set Sail!</Link></Button></p>
    </div>
  );
};

export default LandingPage;
