import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from './Spinner'

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPfpUrl, setNewPfpUrl] = useState('');
  const [newAboutMe, setNewAboutMe] = useState('');

  // Define fetchUserData outside of useEffect
  const fetchUserData = async () => {
    try {
      // Get the user ID from the session storage
      const userId = sessionStorage.getItem('user_id');

      // Include the user ID in the request headers
      const response = await axios.get('http://localhost:5000/me', {
        headers: {
          'X-User-ID': userId
        }
      });

      // Set the user data in the state
      setUserData(response.data);
      setNewPfpUrl(response.data.pfp_url);
      setNewAboutMe(response.data.about_me);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePfpChange = (e) => {
    setNewPfpUrl(e.target.value);
  };

  const handleAboutMeChange = (e) => {
    setNewAboutMe(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send PUT request to update profile
      const response = await axios.put('http://localhost:5000/api/user/profile', {
        profilePictureUrl: newPfpUrl,
        aboutMe: newAboutMe
      });

      console.log(response.data);

      // Refresh user data
      setLoading(true);
      setNewPfpUrl('');
      setNewAboutMe('');

      // Call fetchUserData to update user data after profile update
      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          {/* Display profile picture */}
          <h2><b>{userData.username}</b></h2>
          <img src={newPfpUrl || 'https://via.placeholder.com/150'} className="img-fluid rounded-circle mb-3" alt="Profile" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          {/* Form to change profile picture */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="pfpUrl" className="form-label">New Profile Picture URL</label>
              <input
                type="text"
                className="form-control"
                id="pfpUrl"
                value={newPfpUrl}
                onChange={handlePfpChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="aboutMe" className="form-label">About Me</label>
              <textarea
                className="form-control"
                id="aboutMe"
                rows="3"
                value={newAboutMe}
                onChange={handleAboutMeChange}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
        <div className="col-md-8">
          {/* Display user details */}
          {userData ? (
            <ul className="list-group" style={{ width: '400px', maxWidth: '400px' }}>
              <li className="list-group-item"><b>User Profile</b></li>
              <li className="list-group-item">About Me: {userData.about_me || 'N/A'}</li>
            </ul>
          ) : (
            <p>No user data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
