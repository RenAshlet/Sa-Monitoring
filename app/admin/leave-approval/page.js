"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";

const LeaveApproval = () => {
  const [adminId, setAdminId] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const router = useRouter();

  const [getSaLeaveRequests, setGetSaLeaveRequests] = useState([]);
  const [getSaLeaveRequestsById, setGetSaLeaveRequestsById] = useState([]);

  useEffect(() => {
    setAdminId(sessionStorage.adminId);
    setFirstname(sessionStorage.firstname);
    setLastname(sessionStorage.lastname);
  });

  useEffect(() => {
    if (adminId !== null) {
      retrieveSaLeaveRequests();
    }
  }, [adminId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const [saFullname, setSaFullname] = useState("");
  const [date, setDate] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [approvedStatus, setApprovedStatus] = useState("Approved");

  //--------------- Modal ---------------//
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const handleCloseModal = () => setShowApprovedModal(false);
  const handleShowModal = () => setShowApprovedModal(true);

  const retrieveSaLeaveRequests = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displaySaLeaveRequest",
      },
    });
    setGetSaLeaveRequests(response.data);
    console.log(response.data);
  };

  const retrieveSaLeaveRequestsById = async (leaveId) => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsondata = {
      leaveId: leaveId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsondata),
        operation: "displaySaLeaveRequestById",
      },
    });
    setGetSaLeaveRequestsById(response.data);
    console.log(response.data);

    const SaLeave = response.data[0];
    setSaFullname(SaLeave.sa_fullname);
    setDate(SaLeave.formatted_date);
    setLeaveType(SaLeave.leave_type);
    setReason(SaLeave.reason);
    setApprovedStatus(SaLeave.approved_status);
  };

  const showModal = (leaveId) => {
    retrieveSaLeaveRequestsById(leaveId);
    handleShowModal(true);
  };

  const saveChanges = async () => {
    const url = "http://localhost/nextjs/api/sa-monitoring/admin.php";

    const jsonData = {
      leaveId: getSaLeaveRequestsById[0].leave_id,
      approvedStatus: approvedStatus,
      adminId: adminId,
    };

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "ApprovedLeaveRequest");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      alert("Leave Request approved!");
      retrieveSaLeaveRequests();
    } else {
      alert("Leave Request Failed!");
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
          <h2>Leave request Approval</h2>

          <Table>
            <thead>
              <tr>
                <td>Student Assistant</td>
                <td>Date</td>
                <td>Leave Type</td>
                <td>Approved Status</td>
                <td>Approved By</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {getSaLeaveRequests.map((saLeaveRequest, index) => (
                <tr key={index}>
                  <td>{saLeaveRequest.sa_fullname}</td>
                  <td>{saLeaveRequest.formatted_date}</td>
                  <td>{saLeaveRequest.leave_type}</td>
                  <td>
                    <span
                      className={`badge ${
                        saLeaveRequest.approved_status === "Approved"
                          ? "bg-success"
                          : saLeaveRequest.approved_status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {saLeaveRequest.approved_status}
                    </span>
                  </td>
                  <td>
                    {saLeaveRequest.admin_fullname?.trim() || (
                      <span style={{ color: "gray", fontStyle: "italic" }}>
                        waiting to be approved...
                      </span>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        showModal(saLeaveRequest.leave_id);
                      }}
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>

      {/* Modal for leave approval */}
      <Modal show={showApprovedModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>
              <tr>
                <td>Student Assistant</td>
                <td>{saFullname}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{date}</td>
              </tr>
              <tr>
                <td>Leave Type</td>
                <td>{leaveType}</td>
              </tr>
              <tr>
                <td>Reason</td>
                <td>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter reason for the leave..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="rounded border-1"
                      readOnly
                    />
                  </Form.Group>
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
    </>
  );
};

export default LeaveApproval;
