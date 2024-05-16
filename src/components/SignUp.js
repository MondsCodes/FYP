// Updated SignUp component

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import "../styles/SignUp.css";
import logo2 from "../assets/logo2.png";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [rfid, setRfid] = useState("");

  const [accountCreated, setAccountCreated] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("handleSubmit called");
    console.log("firstName:", firstName);
    console.log("lastName:", lastName);
    console.log("phoneNumber:", phoneNumber);
    console.log("email:", email);
    console.log("dateOfBirth:", dateOfBirth);
    console.log("password:", password);
    console.log("rfid:", rfid);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }

    try {
      const response = await fetch("http://172.20.10.4:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email: email,
          date_of_birth: dateOfBirth,
          rfid_id: rfid,
          password,
        }),
      });

      if (response.status === 400) {
        setErrorMessage(
          "An account with this email already exists. Please use a different email or sign in."
        );
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.detail);
        return;
      }

      // Success! Set accountCreated to true
      setAccountCreated(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error Occured try again");
    }
  };

  if (accountCreated) {
    return <Login />;
  }

  return (
    <div className="container">
      <div className="left-section">
        <img src={logo2} alt="Login" />
      </div>
      <div className="right-section">
        <h1 className="title">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="group">
            <label>First Name</label>
            <input
              required=""
              type="text"
              className="input"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>

          <div class="group">
            <label>Last Name</label>
            <input
              required=""
              type="text"
              className="input"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>

          <div class="group">
            <label>Phone Number</label>
            <input
              required=""
              type="text"
              className="input"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </div>

          <div class="group">
            <label>Email</label>
            <input
              required=""
              type="email"
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div class="group">
            <label>Date Of Birth</label>
            <input
              required=""
              type="date"
              className="input"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
            />
          </div>

          <div class="group">
            <label>Password</label>
            <input
              required=""
              type="password"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div class="group">
            <label>RFID</label>
            <input
              required=""
              type="text"
              className="input"
              value={rfid}
              onChange={(event) => setRfid(event.target.value)}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="button" type="submit">
            Create
          </button>
        </form>

        <div className="new-account">
          Already have an account? <Link to="../login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
