import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Rewards from "../components/Rewards";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://172.20.10.4:8000/api/recycling_counts",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Received data from API:", data);

        setChartData({
          labels: data.dates,
          datasets: [
            {
              label: "Items Recycled",
              data: data.counts,
              fill: false,
              borderColor: "purple",
              tension: 0.1,
            },
          ],
        });
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const [selectedOption, setSelectedOption] = useState("days");
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    fetchStatsData();
  }, [selectedOption]);

  const fetchStatsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://172.20.10.4:8000/api/recycling_times",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatsData(getSelectedStatsData(data));
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const getSelectedStatsData = (data) => {
    switch (selectedOption) {
      case "days":
        return data.past_day_data;
      case "7days":
        return data.past_7_days_data;
      case "30days":
        return data.past_30_days_data;
      case "90days":
        return data.past_90_days_data;
      case "pastYear":
        return data.past_year_data;
      default:
        return [];
    }
  };
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const renderStatsText = () => {
    const latestItems = statsData.slice(0, 5);

    return (
      <div className="column-container">
        {latestItems.map((item, index) => (
          <div className="column" key={index}>
            <div className="render-text">
              <ul>Material: {item.recycled_material}</ul>
              <ul>Date: {new Date(item.disposal_time).toLocaleDateString()}</ul>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://172.20.10.4:8000/api/first_name/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFirstName(data.first_name));
  }, []);

  const [points, setPoints] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://172.20.10.4:8000/api/recycling_data/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPoints(data.points));
  }, []);

  const [totalPoints, setTotalPoints] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://172.20.10.4:8000/api/recycling_data/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setTotalPoints(data.total_points_earned));
  }, []);

  const [itemsRecycled, setItemsRecycled] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://172.20.10.4:8000/api/recycling_data/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setItemsRecycled(data.item_count));
  }, []);

  const [rewardsRedeemed, setrewardsRedeemed] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://172.20.10.4:8000/api/recycling_data/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setrewardsRedeemed(data.rewards));
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <div className="container">
        <div className="left">
          <div className="topleft">
            <p className="points">Hey {firstName}, You have :</p>
            <p className="points-display">
              <span>{points}</span> points
            </p>
            <p className="text-display">
              Earn points to redeem rewards at local stores!
            </p>
          </div>
          <div className="bottomleft">
            <p>Total Points</p>
            <p>{totalPoints}</p>
            <p>Items Recycled</p>
            <p>{itemsRecycled}</p>
            <p>Rewards Redeemed</p>
            <p>{rewardsRedeemed}</p>
            <Link to="../rewards">Claim Rewards</Link>
          </div>
        </div>

        <div className="split"></div>

        <div className="right">
          <div className="line-graph-container">
            {chartData.labels && chartData.labels.length > 0 ? (
              <Line data={chartData} />
            ) : (
              <p>No data available for the chart.</p>
            )}
          </div>
          <div className="bottom-right">
            <div className="time-intervals">
              <ul>
                <li
                  className={selectedOption === "days" ? "active" : ""}
                  onClick={() => handleOptionClick("days")}
                >
                  {" "}
                  Past day
                </li>
                <li
                  className={selectedOption === "7days" ? "active" : ""}
                  onClick={() => handleOptionClick("7days")}
                >
                  {" "}
                  Past 7 days{" "}
                </li>
                <li
                  className={selectedOption === "30days" ? "active" : ""}
                  onClick={() => handleOptionClick("30days")}
                >
                  {" "}
                  Past 30 days
                </li>
                <li
                  className={selectedOption === "90days" ? "active" : ""}
                  onClick={() => handleOptionClick("90days")}
                >
                  {" "}
                  Past 90 days
                </li>
                <li
                  className={selectedOption === "pastYear" ? "active" : ""}
                  onClick={() => handleOptionClick("pastYear")}
                >
                  {" "}
                  Past year
                </li>
              </ul>
            </div>
            <div className="past-activities">
              <ul>{renderStatsText()}</ul>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
