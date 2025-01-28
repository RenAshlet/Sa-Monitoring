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
} from "react-bootstrap";

const Create = () => {
  const [adminId, setAdminId] = useState(null);
  const [adminFirstname, setAdminFirstname] = useState(null);
  const [adminLastname, setAdminLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAdminId(sessionStorage.adminId);
    setAdminFirstname(sessionStorage.firstname);
    setAdminLastname(sessionStorage.lastname);
  });

  useEffect(() => {
    if (adminId !== null) {
      retrieveAllSa();
      retrieveDays();
      retrieveDutyHours();
    }
  }, [adminId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const [saId, setSaId] = useState("");
  const [days, setDays] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dutyHours, setDutyHours] = useState("");

  const [getAllSa, setGetAllSa] = useState([]);
  const [getSaById, setGetSaById] = useState([]);
  const [getDays, setGetDays] = useState([]);
  const [getDutyHours, setGetDutyHours] = useState([]);

  //------------------- Create new Sa Modal --------------------------//
  const [showCreateSaModal, setShowCreateSaModal] = useState(false);
  const handleCloseModal = () => setShowCreateSaModal(false);
  const handleShowModal = () => setShowCreateSaModal(true);

  //------------------- Assign Scheduling for Sa Modal --------------------------//
  const [showAssignSchedModal, setShowAssignSchedModal] = useState(false);
  const handleCloseAssignSchedModal = () => setShowAssignSchedModal(false);
  const handleShowAssignSchedModal = () => setShowAssignSchedModal(true);

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
    console.log("List of Student Assistant:", response.data);
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
    console.log("Selected Student Assistant:", response.data);

    const student = response.data[0];
    setSaId(student.sa_id);
  };

  const retrieveDays = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayDays",
      },
    });
    setGetDays(response.data);
    //console.log("List of Days:", response.data);
  };

  const retrieveDutyHours = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayDutyHours",
      },
    });
    setGetDutyHours(response.data);
    console.log("List of duty hours:", response.data);
  };

  const handleSelectionDay = (event) => {
    setDays(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const selectedDutyHours = (event) => {
    setDutyHours(event.target.value);
  };

  const showAssignSched = (saId) => {
    retrieveSaById(saId);
    handleShowAssignSchedModal(true);
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

  const submitAssignSched = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      saId: saId,
      dayId: days,
      startTime: convertTo24HourFormat(startTime),
      endTime: convertTo24HourFormat(endTime),
      dutyHours: dutyHours,
    };

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "assignSaDutySchedule");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      alert("success");
      setDays("");
      setStartTime("");
      setEndTime("");
    } else {
      alert("failure");
    }
  };

  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
    if (modifier === "AM" && hours === "12") hours = "00";
    return `${hours}:${minutes}`;
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
          <h2>Add Student Assistant</h2>

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
            className="mb-3"
            onClick={() => {
              handleShowModal();
            }}
          >
            Create
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getAllSa.map((sa, index) => {
                return (
                  <tr key={index}>
                    <td>{sa.firstname}</td>
                    <td>{sa.lastname}</td>
                    <td>
                      <Button
                        onClick={() => {
                          showAssignSched(sa.sa_id);
                        }}
                      >
                        Assign
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </div>

      {/* Create Sa Modal */}
      <Modal show={showCreateSaModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create new Student Assistant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>

      {/* Assign Sched Modal */}
      <Modal show={showAssignSchedModal} onHide={handleCloseAssignSchedModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="day">
            <Form.Label>Day</Form.Label>
            <Form.Control
              as="select"
              value={days}
              onChange={handleSelectionDay}
            >
              <option value="">Select Day</option>
              {getDays.map((day, index) => (
                <option key={index} value={day.day_id}>
                  {day.day_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </Form.Group>

          <Form.Group controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
            />
          </Form.Group>

          <Form.Group controlId="dutyhours">
            <Form.Label>Required Duty Hours</Form.Label>
            <Form.Control
              as="select"
              value={dutyHours}
              onChange={selectedDutyHours}
            >
              <option value="">Select Duty Hours</option>
              {getDutyHours.map((hours, index) => {
                return (
                  <option key={index} value={hours.duty_hours_id}>
                    {hours.required_duty_hours} hours
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignSchedModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCloseAssignSchedModal();
              submitAssignSched();
            }}
            disabled={loading || !days || !startTime || !endTime}
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
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Create;
