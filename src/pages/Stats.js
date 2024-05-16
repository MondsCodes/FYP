import Navbar from "../components/Navbar";
import "../styles/Stats.css";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Stats = () => {
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

  const [spentPoints, setSpentPoints] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://172.20.10.4:8000/api/recycling_data/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setSpentPoints(data.total_points_spent));
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

  const [commonItem, setCommonItem] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://172.20.10.4:8000/api/recycling_times/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCommonItem(data.most_recycled_material));
  }, []);

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

  return (
    <React.Fragment>
      <Navbar />
      <div className="stats-container">
        <div className="user-stats">
          <h1>Stats</h1>
          <p>Total Points Acquired: {totalPoints}</p>
          <p>Total Points Spent: {spentPoints}</p>
          <p>Current Points: {points}</p>
          <p>Total Items Recycled: {itemsRecycled} </p>
          <p>Total Rewards Redeemed: {rewardsRedeemed}</p>
          <p>Most Recycled Item: {commonItem}</p>
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
    </React.Fragment>
  );
};

export default Stats;
