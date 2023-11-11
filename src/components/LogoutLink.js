import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/firebase';

const LogoutLink = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <a href="#!" onClick={handleLogout}>Logout</a>
  );
};

export default LogoutLink;
