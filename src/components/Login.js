import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SignUp from "./SignUp";
import "../styles/Login.css";
import logo2 from "../assets/logo2.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [CreateLink, setCreateLink] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleForgotPasswordClick(event) {
    event.preventDefault();
    setForgotPasswordClicked(true);
  }

  async function handleLogin(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    console.log("Email:", trimmedEmail);
    console.log("Password:", trimmedPassword);
    try {
      const response = await axios.post("http://172.20.10.4:8000/api/login/", {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      localStorage.setItem("token", response.data.token);
      setLoginError(null);
      window.location.href = "http://localhost:3000/dashboard";
    } catch (error) {
      console.error(error);
      setLoginError("Invalid email or password");
    }
  }

  return (
    <div className="container">
      <div className="left-section">
        <img src={logo2} alt="Login" />
      </div>
      <div className="right-section">
        <h1 className="title">Login</h1>

        <form onSubmit={handleLogin}>
          <div class="group">
            <label>Email</label>
            <input
              required=""
              type="email"
              class="input"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div class="group">
            <label>Password</label>
            <input
              required=""
              type="password"
              class="input"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          {loginError && <p className="login-error">{loginError}</p>}

          <button className="button" type="submit">
            Login
          </button>
        </form>

        <div className="new-account">
          New here? <Link to="../signup">Sign Up for an account</Link>
        </div>
        <div className="new-account">or</div>
        <div className="new-account">
          <Link>Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
