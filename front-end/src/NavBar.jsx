import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import axios from 'axios';
import AppContext from './AppContext';


function NavBar({ onLogout }) {
    const { session, setSession } = useContext(AppContext); // Consume context here
    const loggedIn = session ? session.loggedIn : false; // Get loggedIn from session
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await axios.post('http://localhost:5000/logout');
        sessionStorage.removeItem('user_id'); // Clear the session token
        setSession({ loggedIn: false }); // Update loggedIn to false
        // Update any other relevant state or perform additional cleanup
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

  return (
    <Navbar expand="lg" className="bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/">Readventure</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/search">Search Books</Nav.Link>
            <NavDropdown title="User Options" id="basic-nav-dropdown">
              {loggedIn ? (
                <>
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/readinglist">Reading List</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>Sign Out</NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">--</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
