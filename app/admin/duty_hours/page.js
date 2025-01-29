"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { useLogout } from "@/components/admin/logout";

const DutyHours = () => {
  const [adminId, setAdminId] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();
  const router = useRouter();

  const [hours, setHours] = useState("");

  useEffect(() => {
    const storedAdminId = sessionStorage.getItem("adminId");
    const storedFirstname = sessionStorage.getItem("firstname");
    const storedLastname = sessionStorage.getItem("lastname");

    if (!storedAdminId) {
      router.push("/");
    } else {
      setAdminId(storedAdminId);
      setFirstname(storedFirstname);
      setLastname(storedLastname);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (adminId !== null) {
    }
  }, [adminId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const addDutyHours = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      requiedDutyHours: hours,
    };

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "addDutyHours");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      alert("Add duty hours successfull.");
      setHours("");
    } else {
      alert("Add duty hours failed!");
    }
  };

  if (isLoading) {
    return null;
  }

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
          <h2>Add Duty Hours</h2>

          <Form.Group className="mb-3">
            <Form.Label className="text-gray-600">Duty Hours</Form.Label>
            <Form.Control
              type="number"
              placeholder="enter duty hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              autoFocus
              className="rounded border border-gray-200 text-black"
            />
          </Form.Group>

          <Button variant="primary" onClick={addDutyHours} disabled={!hours}>
            Submit
          </Button>
        </Container>
      </div>
    </>
  );
};

export default DutyHours;
