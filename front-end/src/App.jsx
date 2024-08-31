import { useState, useCallback, useContext } from 'react';
import React, { useEffect } from 'react';
import './App.css';
import { Route, BrowserRouter, Routes, Link } from 'react-router-dom';
import LandingPage from './LandingPage';
import SearchForm from './SearchForm';
import ReadingList from './ReadingList';
import NavBar from './NavBar';
import LoadingSpinner from './Spinner'; 
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Profile from './Profile'
import AppContext from './AppContext';
import PrivateRoute from './PrivateRoute';

function App() {
  
  const [loading, setLoading] = useState(true); // State to manage loading status
  //const [loggedIn, setLoggedIn] = useState(false);
  
  const {session, setSession} = useContext(AppContext)
  
  const handleLogin = () => {
    setSession(prev => ({
      ...prev, 
      ['loggedIn']: true
    }))
  };


  const handleLogout = () => {
    setSession(prev => ({
      ...prev, 
      ['loggedIn']: false
    }))
  };

  // Simulate loading delay with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 
    return () => clearTimeout(timer); 
  }, []);

  return (
    <>
      <div className="App">
        
        {loading ? ( // Render spinner if loading is true
          <LoadingSpinner />
        ) : (
          // Render routes 
          <BrowserRouter>
           
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<SearchForm />} />
              <Route path="/readinglist" element={<ReadingList />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} /> 
            </Routes>
            <NavBar onLogout={handleLogout}/>
          </BrowserRouter>
        )}
      </div>
    </>
  );
}

export default App;
