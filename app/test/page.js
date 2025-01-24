"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

const Test = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure to log out?");
    if (confirmLogout) {
      sessionStorage.removeItem("saId");
      sessionStorage.removeItem("firstname");
      sessionStorage.removeItem("lastname");
      router.push("/");
    }
  };

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
              <Nav.Link onClick={logout} className="text-light">
                <Icon.BoxArrowDownRight className="me-2" /> Logout
              </Nav.Link>
            </Nav>
          )}
        </div>

        {/* Main Content */}
        <Container style={{ flex: 1, padding: "20px" }}>
          <h1>Welcome to the Test Page</h1>
          <p>This is the main content area.</p>
        </Container>
      </div>
    </>
  );
};

export default Test;
