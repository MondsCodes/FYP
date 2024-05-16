import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Navbar from "../components/Navbar"; // Assuming this is the correct path to your Navbar component
import "../styles/Map.css";

// Fix icon issue in Leaflet 1.7.x
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const binLocation = [52.450202024518546, -1.9358390828668481];

const BinMap = () => {
  const [binDistance, setBinDistance] = useState("Loading...");

  useEffect(() => {
    const fetchBinStatus = async () => {
      try {
        // Adjust this URL to wherever your API is hosted
        const response = await axios.get(
          "http://172.20.10.4:8000/api/bin_status/latest"
        );
        setBinDistance(`${response.data.distance} %`);
      } catch (error) {
        console.error("Failed to fetch bin status:", error);
        setBinDistance("Failed to load distance");
      }
    };

    fetchBinStatus();
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <MapContainer
        center={binLocation}
        zoom={40}
        scrollWheelZoom={true}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={binLocation}>
          <Popup>Fill Level: {binDistance}</Popup>
        </Marker>
      </MapContainer>
    </React.Fragment>
  );
};

export default BinMap;
