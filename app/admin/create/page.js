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
  Table,
  Card,
} from "react-bootstrap";
import ReusableModal from "@/components/modal";
import { useLogout } from "@/components/admin/logout";

const Create = () => {
  const [adminId, setAdminId] = useState(null);
  const [adminFirstname, setAdminFirstname] = useState(null);
  const [adminLastname, setAdminLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    const storedAdminId = sessionStorage.getItem("adminId");
    const storedFirstname = sessionStorage.getItem("firstname");
    const storedLastname = sessionStorage.getItem("lastname");

    if (!storedAdminId) {
      router.push("/");
    } else {
      setAdminId(storedAdminId);
      setAdminFirstname(storedFirstname);
      setAdminLastname(storedLastname);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (adminId !== null) {
      retrieveAllSa();
    }
  }, [adminId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const [saId, setSaId] = useState("");

  const [getAllSa, setGetAllSa] = useState([]);
  const [getSaById, setGetSaById] = useState([]);

  //------------------- Modal --------------------------//
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  //-----------------Create new Sa Account -----------------//
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("defaultpass");

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

  const retrieveAllSa = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayAllSa",
      },
    });
    setGetAllSa(response.data);
  };

  const retrieveSaById = async (saId) => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      saId: saId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displaySaById",
      },
    });
    setGetSaById(response.data);
    const student = response.data[0];
    setSaId(student.sa_id);
  };

  const showAssignSched = (saId) => {
    retrieveSaById(saId);
    router.push(`/admin/create/assign?saId=${saId}`);
  };

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
        retrieveAllSa();
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
          {adminFirstname} {adminLastname}
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

          <Button
            variant="primary"
            className="mb-1"
            onClick={() => {
              handleShowModal();
            }}
          >
            Create
          </Button>

          <Card className="shadow rounded-3 mt-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Student Assistant Schedule</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped bordered hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Student Assistant</th>
                    <th>Day Schedule</th>
                    <th>Time Schedule</th>
                    <th>Required Duty Hours</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllSa.map((sa, index) => (
                    <tr key={index}>
                      <td>{sa.sa_fullname}</td>
                      <td>{sa.day_names}</td>
                      <td>{sa.time_schedule}</td>
                      <td>{sa.required_duty_hours}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className="px-3"
                          onClick={() => showAssignSched(sa.sa_id)}
                        >
                          Assign
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Add student assistant */}
      <ReusableModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        title={"Add Student Assistant"}
        bodyContent={
          <>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded border border-gray-200 text-black"
                  disabled
                />
              </Form.Group>
            </Form>
          </>
        }
        footerContent={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={submit} disabled={loading}>
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
          </>
        }
      />
    </>
  );
};

export default Create;
