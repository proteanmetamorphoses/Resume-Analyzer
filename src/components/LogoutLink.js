import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/firebase";
import "./LogoutLink.css";

const LogoutLink = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <a className="logoutLink" href="#!" onClick={handleLogout}>
      Logout
    </a>
  );
};

export default LogoutLink;