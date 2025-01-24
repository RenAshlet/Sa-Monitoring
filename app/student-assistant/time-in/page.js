"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Container, Table, Button } from "react-bootstrap";

const StudentTimeIn = () => {
  const saId = sessionStorage.saId;
  const firstname = sessionStorage.firstname;
  const lastname = sessionStorage.lastname;
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

  const [getSaTimeIn, setGetSaTimeIn] = useState([]);

  const retrieveSaTimeIn = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/sAssistant.php";

    const jsonData = {
      saId: saId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displaySaTimeIn",
      },
    });
    setGetSaTimeIn(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    retrieveSaTimeIn();
  }, []);

  const timein = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/sAssistant.php";

    const jsonData = {
      saId: saId,
    };

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "SaTimeIn");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      alert("Time-in successful!");
      retrieveSaTimeIn();
    } else {
      alert("Time-in failed! Please try again.");
    }
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
    <Container fluid className="d-flex p-0" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column bg-dark text-white position-relative"
        style={{
          width: sidebarVisible ? "300px" : "0px",
          overflow: "hidden",
          transition: "width 0.3s ease",
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
        <h1 className="mt-3">Student Assistant Time in</h1>

        <Button variant="primary" className="mt-3" onClick={timein}>
          Time-in
        </Button>

        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time-in</th>
              <th>Approved Status</th>
              <th>Status</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            {getSaTimeIn.map((timein, index) => {
              const formatTime = (time) => {
                const [hours, minutes] = time.split(":");
                const date = new Date();
                date.setHours(Number(hours), Number(minutes));
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                });
              };

              const formatDate = (date) => {
                const dateObject = new Date(date);
                return dateObject.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              };

              return (
                <tr key={index}>
                  <td>{formatDate(timein.date)}</td>
                  <td>{formatTime(timein.time_in)}</td>
                  <td>{timein.approved_status}</td>
                  <td>{timein.status}</td>
                  <td>
                    {timein.admin_firstname && timein.admin_lastname
                      ? `${timein.admin_firstname} ${timein.admin_lastname}`
                      : "waiting to be approved"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </Container>
  );
};

export default StudentTimeIn;
