"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import {
  Navbar,
  Nav,
  Container,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";

const Attendance = () => {
  const adminId = sessionStorage.adminId;
  const firstname = sessionStorage.firstname;
  const lastname = sessionStorage.lastname;
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

  //--------------- Time-in Approval Modal ---------------//
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Present");
  const [saFirstname, setSaFirstname] = useState("");
  const [saLastname, setSaLastname] = useState("");
  const [approvedStatus, setApprovedStatus] = useState("Approved");

  //--------------- retrieving time-in data ---------------//
  const [getTimeIn, setGetTimeIn] = useState([]);
  const [getTimeInById, setGetTimeInById] = useState([]);

  //--------------- Modal ---------------//
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const handleCloseModal = () => setShowApprovedModal(false);
  const handleShowModal = () => setShowApprovedModal(true);

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

  const retrieveAllSaTimeIn = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayAllSaTimeIn",
      },
    });
    setGetTimeIn(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    retrieveAllSaTimeIn();
  }, []);

  const retrieveTimeInById = async (timeInId) => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      timeInId: timeInId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displaySaTimeInById",
      },
    });
    setGetTimeInById(response.data);

    const saTimeIn = response.data[0];

    setDate(formatDate(saTimeIn.date));
    setTime(formatTime(saTimeIn.time_in));
    setSaFirstname(saTimeIn.sa_firstname);
    setSaLastname(saTimeIn.sa_lastname);
    setApprovedStatus("Approved");
    setStatus(saTimeIn.status === "Absent" ? "Present" : saTimeIn.status);
  };

  const showModal = (timeInId) => {
    retrieveTimeInById(timeInId);
    handleShowModal(true);
  };

  const saveChanges = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      time_in_id: getTimeInById[0].time_in_id,
      approvedStatus: approvedStatus,
      status: status,
      adminId: adminId,
    };

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "TimeInApprove");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      alert("Approval successful!");
      retrieveAllSaTimeIn();
    } else {
      alert("Approval failed! Please try again.");
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
        <h1>Attendance Review</h1>

        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time-in</th>
              <th>Student Assistant</th>
              <th>Approved Status</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getTimeIn.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No data available, please wait...
                </td>
              </tr>
            ) : (
              getTimeIn.map((timeIn, index) => {
                return (
                  <tr key={index}>
                    <td>{formatDate(timeIn.date)}</td>
                    <td>{formatTime(timeIn.time_in)}</td>
                    <td>
                      {timeIn.sa_lastname}, {timeIn.sa_firstname}
                    </td>
                    <td>{timeIn.approved_status}</td>
                    <td>{timeIn.status}</td>
                    <td>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          showModal(timeIn.time_in_id);
                        }}
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Container>

      <Modal show={showApprovedModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Time-in Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>
              <tr>
                <td>Date</td>
                <td>{date}</td>
              </tr>
              <tr>
                <td>Time</td>
                <td>{time}</td>
              </tr>
              <tr>
                <td>Student Assistant</td>
                <td>
                  {saFirstname} {saLastname}
                </td>
              </tr>
              <tr>
                <td>Approved Status</td>
                <td>
                  <Form.Select
                    value={approvedStatus}
                    onChange={(e) => setApprovedStatus(e.target.value)}
                    className="mb-3"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </td>
              </tr>
              <tr>
                <td>Status</td>
                <td>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mb-3"
                  >
                    <option value="Present">Present</option>
                    <option value="Leave">Leave</option>
                    <option value="Absent">Absent</option>
                  </Form.Select>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              saveChanges();
              handleCloseModal();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Attendance;
