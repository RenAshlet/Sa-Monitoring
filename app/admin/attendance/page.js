"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Container, Table, Button, Form } from "react-bootstrap";
import ReusableModal from "@/components/modal";
import { useLogout } from "@/components/admin/logout";

const Attendance = () => {
  const [adminId, setAdminId] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
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
      setFirstname(storedFirstname);
      setLastname(storedLastname);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (adminId !== null) {
      retrieveAllSaTimeInTrack();
    }
  }, [adminId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  //--------------- Time-in Approval Modal ---------------//
  const [date, setDate] = useState("");
  const [daySched, setDaySched] = useState("");
  const [startTime, setStartTime] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Present");
  const [saFullname, setSaFullname] = useState("");
  const [approvedStatus, setApprovedStatus] = useState("Approved");

  //--------------- retrieving time-in data ---------------//
  const [getAllSaTimeIn, setGetAllSaTimeIn] = useState([]);
  const [getTimeInById, setGetTimeInById] = useState([]);

  //--------------- Modal ---------------//
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  //--------------- Filter State ---------------//
  const [filterStatus, setFilterStatus] = useState("All"); // Default to show all records

  const retrieveAllSaTimeInTrack = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayAllSaTimeInTrack",
      },
    });
    setGetAllSaTimeIn(response.data);
    console.log(response.data);
  };

  const retrieveAllSaTimeInTrackById = async (timeInId) => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      timeInId: timeInId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displayAllSaTimeInTrackById",
      },
    });
    setGetTimeInById(response.data);

    const saTimeIn = response.data[0];

    setDate(saTimeIn.formatted_date);
    setDaySched(saTimeIn.day_name);
    setStartTime(saTimeIn.time_start);
    setTime(saTimeIn.time_in);
    setSaFullname(saTimeIn.sa_fullname);
    setApprovedStatus("Approved");
    setStatus(saTimeIn.status === "Absent" ? "Present" : saTimeIn.status);
  };

  const showApprovedModal = (timeInId) => {
    retrieveAllSaTimeInTrackById(timeInId);
    handleShowModal(true);
  };

  const saveChanges = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      time_in_id: getTimeInById[0].track_id,
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
      retrieveAllSaTimeInTrack();
    } else {
      alert("Approval failed! Please try again.");
    }
  };

  //--------------- Filter Logic ---------------//
  const filteredData = getAllSaTimeIn.filter((timeIn) => {
    if (filterStatus === "All") {
      return true;
    }
    return timeIn.status === filterStatus;
  });

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

        <Container fluid style={{ flex: 1, padding: "20px" }}>
          <h2>Attendance Review</h2>

          {/* Filter Dropdown */}
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mb-3"
            style={{ width: "200px" }}
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </Form.Select>

          <Table striped bordered hover responsive className="table-custom">
            <thead className="table-primary">
              <tr>
                <th>Date</th>
                <th>Day Schedule</th>
                <th>Time Schedule</th>
                <th>Time-in</th>
                <th>Time-out</th>
                <th>Approved Status</th>
                <th>Status</th>
                <th>Student Assistant</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center"
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      backgroundColor: "#f8d7da",
                    }}
                  >
                    No data available, please wait...
                  </td>
                </tr>
              ) : (
                filteredData.map((timeIn, index) => {
                  return (
                    <tr key={index}>
                      <td>{timeIn.formatted_date}</td>
                      <td>{timeIn.day_name}</td>
                      <td>{timeIn.time_schedule}</td>
                      <td>{timeIn.time_in}</td>
                      <td>{timeIn.time_out}</td>
                      <td>
                        <span
                          className={`badge ${
                            timeIn.approved_status === "Approved"
                              ? "bg-success"
                              : timeIn.approved_status === "Pending"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {timeIn.approved_status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            timeIn.status === "On Time"
                              ? "bg-success"
                              : timeIn.status === "Late"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {timeIn.status}
                        </span>
                      </td>
                      <td>
                        {timeIn.sa_fullname?.trim() || (
                          <span style={{ color: "gray", fontStyle: "italic" }}>
                            waiting to be approved...
                          </span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            showApprovedModal(timeIn.track_id);
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
      </div>

      {/* Modal for time-in approval */}
      <ReusableModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        title={"Time-in Approval"}
        bodyContent={
          <>
            <Table>
              <tbody>
                <tr>
                  <td>Date</td>
                  <td>{date}</td>
                </tr>
                <tr>
                  <td>Day Schedule</td>
                  <td>{daySched}</td>
                </tr>
                <tr>
                  <td>Time Start</td>
                  <td>{startTime}</td>
                </tr>
                <tr>
                  <td>Time In</td>
                  <td>{time}</td>
                </tr>
                <tr>
                  <td>Student Assistant</td>
                  <td>{saFullname}</td>
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
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                    </Form.Select>
                  </td>
                </tr>
              </tbody>
            </Table>
          </>
        }
        footerContent={
          <>
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
          </>
        }
      />
    </>
  );
};

export default Attendance;
