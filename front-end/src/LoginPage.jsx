import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });

      // Call onLogin function to update logged-in status in App component
      onLogin(response.data);

      // Store session token in local storage
      localStorage.setItem('sessionToken', response.data.id);
      console.log('Session token stored:', response.data.id);
      

      // Redirect the user to another page upon successful login
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid credentials");
      } else {
        setError("An unexpected error occurred");
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
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
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">Login</button>
                </div>
              </form>
              <p className="mt-3">Not registered? <Link to="/register">Click here to sign up!</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
