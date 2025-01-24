"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Icon from "react-bootstrap-icons";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";

const Create = () => {
  const adminId = sessionStorage.adminId;
  const adminFirstname = sessionStorage.firstname;
  const adminLastname = sessionStorage.lastname;
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

  //------------------ Create Account -----------------//
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("defaultpass");
  const [loading, setLoading] = useState(false);
 

  const [alertShow, setAlertShow] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  const showAlert = (variant, message) => {
    setAlertShow({ show: true, variant, message });
    setTimeout(() => {
      setAlertShow((prev) => ({ ...prev, show: false }));
    }, 900);
  };

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

  const submit = async () => {
    if (!firstname && !lastname && !username) {
      showAlert("danger", "Please fill up all fields!");
      return;
    } else if (!firstname) {
      showAlert("warning", "Firstname is required!");
      return;
    } else if (!lastname) {
      showAlert("warning", "Lastname is required!");
      return;
    } else if (!username) {
      showAlert("warning", "Username is required!");
      return;
    }

    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
    };

    const formData = new FormData();
    formData.append("operation", "createSaAccount");
    formData.append("json", JSON.stringify(jsonData));

    setLoading(true);
    try {
      const response = await axios({
        url: url,
        method: "POST",
        data: formData,
      });

      if (response.data == 1) {
        showAlert("success", "Account created successfully!");
        setFirstname("");
        setLastname("");
        setUsername("");
      } else if (response.data == 2) {
        showAlert("danger", "Username already exists!");
      } else {
        showAlert("warning", "Account creation failed!");
      }
    } catch (error) {
      showAlert("danger", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
    <Container fluid className="d-flex p-0" style={{ height: "100vh" }}>
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
              {adminFirstname} {adminLastname}
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
        <h1>Create Account</h1>

        {alertShow.show && (
          <Modal
            show={alertShow.show}
            onHide={() => setAlertShow({ ...alertShow, show: false })}
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body
              style={{
                backgroundColor: "#f0f0f5",
                borderRadius: "12px",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h5
                style={{
                  color:
                    alertShow.variant === "danger"
                      ? "#d9534f"
                      : alertShow.variant === "warning"
                      ? "#f0ad4e"
                      : "#5cb85c",
                  fontWeight: "bold",
                }}
              >
                {alertShow.message}
              </h5>
            </Modal.Body>
          </Modal>
        )}

        <Form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label className="text-gray-600">Firstname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              autoFocus
              className="rounded border border-gray-200 text-black"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-gray-600">Lastname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="rounded border border-gray-200 text-black"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-gray-600">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded border border-gray-200 text-black"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-gray-600">Password</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border border-gray-200 text-black"
              readOnly
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={submit}
            className="w-100 mb-2 bg-[#7747ff] text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Form>
      </Container>
    </Container>
  );
};

export default Create;
