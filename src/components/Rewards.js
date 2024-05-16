import React, { useState } from "react";
import axios from "axios";
import "../styles/Rewards.css";
import Navbar from "../components/Navbar";

const RedeemPoints = () => {
  const [points, setPoints] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve the authentication token

    setError(""); // Reset error message

    try {
      const response = await axios.post(
        "http://172.20.10.4:8000/api/redeem/",
        {
          points_to_use: points,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setQrCodeUrl(response.data.qr_code_url);
    } catch (err) {
      console.error("Error:", err);
      setError("Insufficient Points");
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="redeem-container">
        <h2>Redeem Points</h2>
        <form onSubmit={handleSubmit} className="redeem-form">
          <div className="form-group">
            <input
              type="number"
              id="points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn-submit">
            Redeem
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {qrCodeUrl && (
          <div className="qr-code">
            <img src={`http://172.20.10.4:8000${qrCodeUrl}`} alt="QR Code" />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default RedeemPoints;
