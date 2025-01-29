"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Container, Table, Button } from "react-bootstrap";
import { useLogout } from "@/components/student/logout";

const Dashboard = () => {
  const [saId, setSaId] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const logout = useLogout();

  const [getSaDutySchedule, setGetSaDutySchedule] = useState([]);

  useEffect(() => {
    setSaId(sessionStorage.saId);
    setFirstname(sessionStorage.firstname);
    setLastname(sessionStorage.lastname);
  }, []);

  useEffect(() => {
    if (saId !== null) {
      retrieveSaDutySchedule();
    }
  }, [saId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const retrieveSaDutySchedule = async () => {
    const url =
      "http://localhost/nextjs/api/sa-monitoring/studentAssistant.php";

    const jsonData = {
      saId: saId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displaySaDutySchedule",
      },
    });
    setGetSaDutySchedule(response.data);
    console.log(response.data);
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
        <h6 className="ms-auto" style={{ color: "white" }}>
          {firstname} {lastname}
        </h6>
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
              <Nav.Link href="apply-leave" className="text-light">
                <Icon.FileEarmarkText className="me-2" /> Apply Leave
              </Nav.Link>
              <Nav.Link onClick={logout} className="text-light">
                <Icon.BoxArrowDownRight className="me-2" /> Logout
              </Nav.Link>
            </Nav>
          )}
        </div>

        {/* Main Content */}
        <Container fluid style={{ flex: 1, padding: "20px" }}>
          <h1>Dashboard</h1>

          <Table>
            <thead>
              <tr>
                <td>Day Schedule</td>
                <td>Time Schedule</td>
                <td>Total Duty Hours</td>
                <td>Rendered Duty Hours</td>
                <td>Required Duty Hours</td>
              </tr>
            </thead>
            <tbody>
              {getSaDutySchedule.map((saDutySchedule, index) => {
                return (
                  <tr key={index}>
                    <td>{saDutySchedule.day_names}</td>
                    <td>{saDutySchedule.time_schedule}</td>
                    <td>{saDutySchedule.total_duty_hours_formatted}</td>
                    <td>{saDutySchedule.rendered_vs_required}</td>
                    <td>{saDutySchedule.required_duty_hours}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
