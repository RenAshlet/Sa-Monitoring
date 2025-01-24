"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const AdminDashboard = () => {
  const adminId = sessionStorage.adminId;
  const firstname = sessionStorage.firstname;
  const lastname = sessionStorage.lastname;
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!adminId) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return null;
  }

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
    <Container fluid className="d-flex p-0" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column bg-dark text-white"
        style={{
          width: sidebarVisible ? "250px" : "0px",
          overflow: "hidden",
          transition: "width 0.3s ease",
        }}
      >
        <Navbar
          bg="dark"
          variant="dark"
          expand="lg"
          className="flex-column p-3 h-100"
          style={{
            width: "100%",
          }}
        >
          <Navbar.Brand href="#" className="mb-4">
            Admin Page
          </Navbar.Brand>
          <Nav className="flex-column">
            <Nav.Link href="/admin/dashboard" className="text-white">
              <Icon.HouseDoorFill className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link href="/admin/create-account" className="text-white">
              <Icon.PersonPlusFill className="me-2" /> Create Account
            </Nav.Link>
            <Nav.Link href="/admin/attendance" className="text-white">
              Attendance
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
              style={{ cursor: "pointer" }}
            >
              <Icon.BoxArrowRight className="me-2" /> Logout
            </Nav.Link>
          </div>
        </Navbar>
      </div>

      {/* Main Content */}
      <Container fluid className="p-4">
        <Button
          variant="dark"
          className="mb-3"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          {sidebarVisible ? <Icon.X size={24} /> : <Icon.List size={24} />}
        </Button>
        <h1>Dashboard</h1>
      </Container>
    </Container>
  );
};

export default AdminDashboard;
