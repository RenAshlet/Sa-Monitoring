"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Table,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useLogout } from "@/components/student/logout";

const TrackTime = () => {
  const [saId, setSaId] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();
  const router = useRouter();

  const [getSaDutySchedule, setGetSaDutySchedule] = useState([]);
  const [getSaTimeInTrack, setGetSaTimeInTrack] = useState([]);
  const [currentDaySchedule, setCurrentDaySchedule] = useState(null); // selected sa_duty_schedule

  //const [timeOut, setTimeOut] = useState("");

  useEffect(() => {
    const storedSaId = sessionStorage.getItem("saId");
    const storedFirstname = sessionStorage.getItem("firstname");
    const storedLastname = sessionStorage.getItem("lastname");

    if (!storedSaId) {
      router.push("/");
    } else {
      setSaId(storedSaId);
      setFirstname(storedFirstname);
      setLastname(storedLastname);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (saId !== null) {
      retrieveSaDutySchedule();
      retrieveSaTimeInTrack();
    }
  }, [saId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const retrieveSaDutySchedule = async () => {
    const url =
      "http://localhost/nextjs/api/sa-monitoring/studentAssistant.php";

    const jsonData = {
      saId: saId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displaySaDutySchedule",
      },
    });
    const schedules = response.data;
    setGetSaDutySchedule(schedules);
    const currentDayName = new Date().toLocaleString("en-US", {
      weekday: "long",
    });
    // const todaySchedule = schedules.find(
    //   (schedule) => schedule.day_names === currentDayName
    // );

    // Find the schedule for today
    const todaySchedule = schedules.find((schedule) =>
      schedule.day_names.includes(currentDayName)
    );

    if (todaySchedule) {
      setCurrentDaySchedule(todaySchedule.duty_schedule_id);
    } else {
      console.log("You have no schedule today");
    }
  };

  const retrieveSaTimeInTrack = async () => {
    const url =
      "http://localhost/nextjs/api/sa-monitoring/studentAssistant.php";

    const jsonData = {
      saId: saId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displaySaTimeInTrack",
      },
    });
    setGetSaTimeInTrack(response.data);
    //console.log("Student Assistants Time in track:", response.data);
  };

  const SaTimeIn = async () => {
    if (!currentDaySchedule) {
      alert("No schedule today. Cannot time in.");
      return;
    }

    const url =
      "http://localhost/nextjs/api/sa-monitoring/studentAssistant.php";

    const jsonData = {
      saId: saId,
      dutyScheduleId: currentDaySchedule,
    };

    //console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "SaTimeIn");
    formData.append("json", JSON.stringify(jsonData));

    try {
      const response = await axios({
        url: url,
        method: "POST",
        data: formData,
      });

      if (response.data.success) {
        alert(response.data.message);
        retrieveSaTimeInTrack();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const SaTimeOut = async () => {
    if (!currentDaySchedule) {
      alert("No schedule today. Cannot time out.");
      return;
    }

    const url =
      "http://localhost/nextjs/api/sa-monitoring/studentAssistant.php";

    const jsonData = {
      trackId: getSaTimeInTrack[0].track_id,
      dutyScheduleId: currentDaySchedule,
    };

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "SaTimeOut");
    formData.append("json", JSON.stringify(jsonData));

    try {
      const response = await axios({
        url: url,
        method: "POST",
        data: formData,
      });

      if (response.data.success) {
        alert(response.data.message);
        retrieveSaTimeInTrack();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  // const handleTimeOut = (event) => {
  //   setTimeOut(event.target.value);
  // };

  // const convertTo24HourFormat = (time) => {
  //   const [timePart, modifier] = time.split(" ");
  //   let [hours, minutes] = timePart.split(":");
  //   if (modifier === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
  //   if (modifier === "AM" && hours === "12") hours = "00";
  //   return `${hours}:${minutes}`;
  // };

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
          Student Assistant
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
              <Nav.Link
                href="/student-assistant/dashboard"
                className="text-light"
              >
                <Icon.Grid className="me-2" /> Dashboard
              </Nav.Link>
              <Nav.Link
                href="/student-assistant/track-time"
                className="text-light"
              >
                <Icon.Stopwatch className="me-2" /> Track Time
              </Nav.Link>
              <Nav.Link href="apply-leave" className="text-light">
                <Icon.FileEarmarkText className="me-2" /> Apply Leave
              </Nav.Link>
              <Nav.Link onClick={logout} className="text-light">
                <Icon.BoxArrowDownRight className="me-2" /> Logout
              </Nav.Link>
            </Nav>
          )}
        </div>

        {/* Main Content */}
        <Container fluid style={{ flex: 1, padding: "20px" }}>
          <h2>Time Track</h2>
          <Row className="mb-3">
            <Col className="d-flex justify-content-between">
              <Button
                variant="primary"
                onClick={SaTimeIn}
                disabled={!currentDaySchedule}
              >
                Time in
              </Button>

              <Button
                variant="secondary"
                onClick={SaTimeOut}
                disabled={!currentDaySchedule}
              >
                Time out
              </Button>
            </Col>
            {/* <Form.Group controlId="endTime" className="mt-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={}
                onChange={}
              />
            </Form.Group> */}
          </Row>

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
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              {getSaTimeInTrack.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
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
                getSaTimeInTrack.map((timeIn, index) => (
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
                      {timeIn.admin_fullname?.trim() || (
                        <span style={{ color: "gray", fontStyle: "italic" }}>
                          waiting to be approved...
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Container>
      </div>
    </>
  );
};

export default TrackTime;
