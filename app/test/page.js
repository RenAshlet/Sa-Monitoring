"use client";
import React, { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const generateTimeSlots = () => {
  const times = [];
  let hours = 0;
  let minutes = 0;

  while (hours < 24) {
    const amPm = hours < 12 ? "AM" : "PM";
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const displayMinutes = minutes.toString().padStart(2, "0");

    times.push({
      display: `${displayHours}:${displayMinutes} ${amPm}`,
      value: `${hours.toString().padStart(2, "0")}:${displayMinutes}`, // 24-hour format
    });

    minutes += 30;
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
  }

  return times;
};

const Test = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedTime, setSelectedTime] = useState("");
 

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    console.log(`Selected Time (24-hour format): ${e.target.value}`);
  };

  const timeSlots = generateTimeSlots();

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        expand="lg"
        style={{ backgroundColor: "#343a40" }}
        className="px-3"
      >
        <Navbar.Brand href="#" className="text-light">
          Student Assistant
        </Navbar.Brand>
        <Button
          variant="outline-light"
          onClick={toggleSidebar}
          className="me-2"
        >
          {isSidebarVisible ? <Icon.List size={20} /> : <Icon.X size={20} />}
        </Button>
      </Navbar>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: isSidebarVisible ? "250px" : "0",
            color: "white",
            padding: isSidebarVisible ? "20px" : "0",
            overflow: "hidden",
            transition: "width 0.3s ease, padding 0.3s ease",
          }}
          className="bg-dark"
        >
          {isSidebarVisible && (
            <Nav className="flex-column">
              <Nav.Link
                href="/student-assistant/dashboard"
                className="text-light"
              >
                <Icon.Grid className="me-2" /> Dashboard
              </Nav.Link>
              <Nav.Link
                href="/student-assistant/track-time"
                className="text-light"
              >
                <Icon.Stopwatch className="me-2" /> Track Time
              </Nav.Link>
             
            </Nav>
          )}
        </div>

        {/* Main Content */}
        <Container style={{ flex: 1, padding: "20px" }}>
          <h1>Set Time</h1>
          <p>Choose a time (fixed at 30-minute intervals):</p>

          <select
            value={selectedTime}
            onChange={handleTimeChange}
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select a time</option>
            {timeSlots.map((time, index) => (
              <option key={index} value={time.value}>
                {time.display}
              </option>
            ))}
          </select>

          {selectedTime && (
            <div style={{ marginTop: "20px" }}>
              <h2>Selected Time</h2>
              <p>
                <strong>12-hour format:</strong> {timeSlots.find((t) => t.value === selectedTime)?.display}
              </p>
              <p>
                <strong>24-hour format:</strong> {selectedTime}
              </p>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default Test;
