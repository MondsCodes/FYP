import Navbar from "../components/Navbar";
import "../styles/Help.css";

// help.js

import React, { useState } from "react";

const Help = () => {
  const [faq1Expanded, setFaq1Expanded] = useState(false);
  const [faq2Expanded, setFaq2Expanded] = useState(false);
  const [faq3Expanded, setFaq3Expanded] = useState(false);
  const [faq4Expanded, setFaq4Expanded] = useState(false);

  const toggleFaq = (faqNumber) => {
    switch (faqNumber) {
      case 1:
        setFaq1Expanded(!faq1Expanded);
        break;
      case 2:
        setFaq2Expanded(!faq2Expanded);
        break;
      case 3:
        setFaq3Expanded(!faq3Expanded);
        break;
      case 4:
        setFaq4Expanded(!faq4Expanded);
        break;
      default:
        break;
    }
  };

  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <React.Fragment>
      <Navbar />

      <div className="help-container">
        <div className="description">
          PinBin facilitates a sophisticated waste management system for
          students and staff members, empowering them to intelligently engage
          with waste bins. Users can effortlessly pinpoint bin locations on the
          map, assess bin capacities, amass points through recycling endeavors,
          and gain insights into their respective rankings within the system!
        </div>
        <div className="faq" onClick={() => toggleFaq(1)}>
          <h3>How to dispose item:</h3>
          {faq1Expanded && (
            <p>
              Dispose of an item by placing it into the designated waste bin
              equipped with IoT devices. The system will automatically detect
              the disposal event, classify the item, and reward you with points
              based on its recyclability.
            </p>
          )}
        </div>

        <div className="faq" onClick={() => toggleFaq(2)}>
          <h3>How can I earn points:</h3>
          {faq2Expanded && (
            <p>
              To earn points, simply dispose of recyclable items in the
              designated waste bin equipped with IoT devices, and our system
              will automatically reward you based on the type and quantity of
              items recycled.
            </p>
          )}
        </div>

        <div className="faq" onClick={() => toggleFaq(3)}>
          <h3>I can’t see my points:</h3>
          {faq3Expanded && (
            <p>
              If your disposed item isn't recyclable, it might not accrue
              points. The system typically rewards points for recycling
              activities, and if an item is classified as non-recyclable, it may
              not contribute to your points balance. Make sure to dispose of
              items that fall into recyclable categories such as plastic, paper,
              cardboard, metal, or glass to earn points for your efforts. If you
              have concerns or questions about specific items, check the app's
              guidelines or contact customer support for clarification.
            </p>
          )}
        </div>

        <div className="faq" onClick={() => toggleFaq(4)}>
          <h3>I disposed a recyclable item but I can’t see my points:</h3>
          {faq4Expanded && (
            <p>
              If you can't see your points after disposing of an item, please
              ensure that you have tapped your NFC card on the card reader
              associated with the bin. The system uses this interaction to link
              the disposal event to your account and allocate points
              accordingly. If the issue persists, check your account details,
              and if the problem continues, contact our customer support for
              assistance.
            </p>
          )}
        </div>

        <div className="main-container">
          <h2 onClick={toggleFormVisibility} style={{ cursor: "pointer" }}>
            Contact Us
          </h2>

          {isFormVisible && (
            <form
              target="_blank"
              action="https://formsubmit.co/daniel.ogidi015@gmail.com"
              method="POST"
            >
              <div className="form">
                <div className="form-row">
                  <div className="form-col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="form-col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form">
                <textarea
                  className="message"
                  placeholder="Message"
                  rows="10"
                  required
                ></textarea>
              </div>
              <button className="submit" type="submit">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Help;
