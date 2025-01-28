"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Container, Button, Table, Dropdown } from "react-bootstrap";

const Dashboard = () => {
  const [adminId, setAdminId] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("Present");
  const router = useRouter();

  const [getSaStatus, setGetSaStatus] = useState([]);

  useEffect(() => {
    setAdminId(sessionStorage.adminId);
    setFirstname(sessionStorage.firstname);
    setLastname(sessionStorage.lastname);
  });

  useEffect(() => {
    if (adminId !== null) {
      retrieveSaStatus();
    }
  }, [adminId, selectedStatus]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const retrieveSaStatus = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/monitoring.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({ status: selectedStatus }),
        operation: "displaySaStatus",
      },
    });
    setGetSaStatus(response.data);
    console.log("List of duty hours:", response.data);
  };

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure to log out?");
    if (confirmLogout) {
      sessionStorage.removeItem("adminId");
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
          Admin Page
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
              <Nav.Link href="/admin/dashboard" className="text-light">
                <Icon.Grid className="me-2" /> Dashboard
              </Nav.Link>
              <Nav.Link href="/admin/duty_hours" className="text-light">
                <Icon.Clock className="me-2" /> Duty Hours
              </Nav.Link>
              <Nav.Link href="/admin/create" className="text-light">
                <Icon.PersonPlus className="me-2" /> Create Assistant
              </Nav.Link>
              <Nav.Link href="/admin/attendance" className="text-light">
                <Icon.ClipboardCheck className="me-2" /> Attendance
              </Nav.Link>
              <Nav.Link href="/admin/leave-approval" className="text-light">
                <Icon.Check2Circle className="me-2" /> Leave Approval
              </Nav.Link>
              <Nav.Link onClick={logout} className="text-light">
                <Icon.BoxArrowDownRight className="me-2" /> Logout
              </Nav.Link>
            </Nav>
          )}
        </div>

        {/* Main Content */}
        <Container fluid style={{ flex: 1, padding: "20px" }}>
          <h2>Admin Dashboard</h2>

          <Dropdown onSelect={(eventKey) => setSelectedStatus(eventKey)}>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {selectedStatus}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Present">Present</Dropdown.Item>
              <Dropdown.Item eventKey="Absent">Absent</Dropdown.Item>
              <Dropdown.Item eventKey="Late">Late</Dropdown.Item>
              {/* Add more statuses as needed */}
            </Dropdown.Menu>
          </Dropdown>

          <Table>
            <thead>
              <tr>
                <td>Student Assistant</td>
                <td>Time Schedule</td>
                <td>Date</td>
                <td>Day</td>
                <td>Time in</td>
                <td>Time out</td>
                <td>Approved Status</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
              {getSaStatus.map((saStatus, index) => {
                return (
                  <tr key={index}>
                    <td>{saStatus.sa_fullname}</td>
                    <td>{saStatus.time_schedule}</td>
                    <td>{saStatus.formatted_date}</td>
                    <td>{saStatus.day_name}</td>
                    <td>{saStatus.time_in}</td>
                    <td>{saStatus.time_out}</td>
                    <td>{saStatus.approved_status}</td>
                    <td>{saStatus.status}</td>
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
