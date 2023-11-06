import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/firebase'; // adjust the path as necessary

const LogoutLink = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // or wherever you want to redirect after logout
  };

  return (
    <a href="#!" onClick={handleLogout}>Logout</a>
  );
};

export default LogoutLink;
