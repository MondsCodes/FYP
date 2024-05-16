import React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";
import logo2 from "../assets/logo2.png";
import logo1 from "../assets/logo1.png";

function Navbar() {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const [isLogo1, setIsLogo1] = useState(true);

  const handleLogoHover = () => {
    setIsLogo1(!isLogo1);
  };

  return (
    <header>
      <h3>
        <img
          className="logo"
          src={isLogo1 ? logo1 : logo2}
          alt="Logo"
          onMouseOver={handleLogoHover}
        />
      </h3>
      <nav ref={navRef}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/map">Map</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/stats">Stats</Link>
        <Link to="/help">Help</Link>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
