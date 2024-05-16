import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your API
        const response = await fetch("http://172.20.10.4:8000/api/leaderboard");

        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }

        const data = await response.json();

        // Sort the data by points in descending order
        const sortedData = data.sort((a, b) => b.points - a.points);

        setLeaderboardData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <React.Fragment>
      <Navbar />
      <div className="leaderboard-container">
        <h1>Leaderboard</h1>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Items Recycled</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player.first_name + " " + player.last_name}</td>
                <td>{player.items_recycled}</td>
                <td>{player.total_points_earned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default Leaderboard;
