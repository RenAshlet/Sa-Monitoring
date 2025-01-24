"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const SaDashboard = () => {
  const saId = sessionStorage.saId;
  const firstname = sessionStorage.firstname;
  const lastname = sessionStorage.lastname;
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

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
    <Container fluid className="d-flex p-0" style={{ height: "100vh" }}>
      <div
        className="d-flex flex-column bg-dark text-white position-relative"
        style={{
          width: sidebarVisible ? "300px" : "0px",
          overflow: "hidden",
          transition: "width 0.3s ease",
          boxShadow: sidebarVisible ? "4px 0 6px rgba(0, 0, 0, 0.3)" : "none", // Add box-shadow to create a boundary effect
        }}
      >
        {sidebarVisible && (
          <Button
            variant="light"
            className="position-absolute"
            style={{
              top: "10px",
              right: "10px",
              zIndex: 1000,
              padding: "5px 10px",
              fontSize: "14px",
            }}
            onClick={() => setSidebarVisible(false)}
          >
            <Icon.X size={20} />
          </Button>
        )}
        <Navbar
          bg="dark"
          variant="dark"
          expand="lg"
          className="flex-column p-3 h-100"
          style={{
            width: "100%",
          }}
        >
          <Navbar.Brand
            href="#"
            className="mb-4 text-center w-100"
            style={{ marginTop: "40px" }}
          >
            Student Assistant
          </Navbar.Brand>
          <Nav className="flex-column">
            <Nav.Link
              href="/student-assistant/dashboard"
              className="text-white"
              style={{
                borderRadius: "5px",
                padding: "10px 15px",
                display: "block",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#3a3a3a";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <Icon.HouseDoorFill className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link
              href="time-in"
              className="text-white"
              style={{
                borderRadius: "5px",
                padding: "10px 15px",
                display: "block",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#3a3a3a";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <Icon.Clock className="me-2" /> Time-In
            </Nav.Link>
          </Nav>
          <div className="mt-auto text-white border-top pt-3">
            <p className="mb-1">Logged in as:</p>
            <p className="fw-bold mb-2">
              {firstname} {lastname}
            </p>
            <Nav.Link
              onClick={logout}
              className="text-white"
              style={{
                cursor: "pointer",
                borderRadius: "5px",
                padding: "10px 15px",
                display: "block",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#3a3a3a";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <Icon.BoxArrowRight className="me-2" /> Logout
            </Nav.Link>
          </div>
        </Navbar>
      </div>

      {/* Main Content */}
      <Container fluid className="p-4">
        {!sidebarVisible && (
          <Button
            variant="dark"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              padding: "5px 10px",
              fontSize: "14px",
            }}
            onClick={() => setSidebarVisible(true)}
          >
            <Icon.List size={20} />
          </Button>
        )}
        <h1 className="mt-3">Student Assistant Dashboard</h1>
      </Container>
    </Container>
  );
};

export default SaDashboard;
