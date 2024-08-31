import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function RegisterPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       // Register new user
       const registerResponse = await axios.post('http://localhost:5000/register', { username, password });
       console.log(registerResponse.data); 

      // Log in the new user
      const loginResponse = await axios.post('http://localhost:5000/login', { username, password });
      console.log(loginResponse.data);

    
      // Call the onLogin function with user data
      onLogin(loginResponse.data);

      // Store session token in local storage
      localStorage.setItem('sessionToken', loginResponse.data.id);

      
      navigate('/');
    } catch (err) {
      console.error('Registration Error:', err); 
      setError(err.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">Register</div>
            <div className="card-body">
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">Register</button>
                </div>
              </form>
              <p className="mt-3">Already registered? <Link to="/login">Click here to login!</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
