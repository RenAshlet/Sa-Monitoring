"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Container, Button, Spinner } from "react-bootstrap";
import { useLogout } from "@/components/admin/logout";

const Dashboard = () => {
  const [adminId, setAdminId] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();
  const router = useRouter();

  // Fetch session data once on component mount
  useEffect(() => {
    const storedAdminId = sessionStorage.getItem("adminId");
    const storedFirstname = sessionStorage.getItem("firstname");
    const storedLastname = sessionStorage.getItem("lastname");

    if (!storedAdminId) {
      router.push("/");
    } else {
      setAdminId(storedAdminId);
      setFirstname(storedFirstname || "");
      setLastname(storedLastname || "");
      setIsLoading(false);
    }
  }, [router]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      {/* Top Navbar */}
      <Navbar expand="lg" bg="dark" variant="dark" className="px-3">
        <Navbar.Brand href="#">Admin Page</Navbar.Brand>
        <Button
          variant="outline-light"
          onClick={toggleSidebar}
          className="me-2"
          aria-label="Toggle Sidebar"
        >
          {isSidebarVisible ? <Icon.List size={20} /> : <Icon.X size={20} />}
        </Button>
        <h6 className="ms-auto text-light mb-0">
          {firstname} {lastname}
        </h6>
      </Navbar>

      {/* Main Layout */}
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: isSidebarVisible ? "250px" : "0",
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
                <Icon.PersonPlus className="me-2" /> Student Assistant
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
          {/* Add your main content here */}
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
