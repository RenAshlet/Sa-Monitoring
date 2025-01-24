"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Icon from "react-bootstrap-icons";
import { Navbar, Nav, Button, Container, Table } from "react-bootstrap";

const Dashboard = () => {
  const [saId, setSaId] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const router = useRouter();

  const [getSaDutySchedule, setGetSaDutySchedule] = useState([]);

  useEffect(() => {
    setSaId(sessionStorage.saId);
    setFirstname(sessionStorage.firstname);
    setLastname(sessionStorage.lastname);
  }, []);

  useEffect(() => {
    if (saId !== null) {
      retrieveSaDutySchedule();
    }
  }, [saId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const retrieveSaDutySchedule = async () => {
    const url =
      "http://localhost/nextjs/api/sa-monitoring/studentAssistant.php";

    //const url = "http://192.168.1.48/nextjs/api/sa-monitoring/studentAssistant.php";

    const jsonData = {
      saId: saId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displaySaDutySchedule",
      },
    });
    setGetSaDutySchedule(response.data);
    //console.log("Student Assistants duty schedule:", response.data);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timeSlots = [
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const isDayScheduled = (day) => {
    return getSaDutySchedule.some((schedule) => schedule.day_name === day);
  };

  const isStartTime = (day, time) => {
    return getSaDutySchedule.some(
      (schedule) => schedule.day_name === day && schedule.time_start === time
    );
  };

  const isEndTime = (day, time) => {
    return getSaDutySchedule.some((schedule) => {
      const endTime = schedule.time_end;
      const timeEnd = endTime === "06:00 PM" ? "05:00 PM" : endTime;

      return schedule.day_name === day && timeEnd === time;
    });
  };

  const getFullNameForSchedule = (day, time) => {
    const schedule = getSaDutySchedule.find(
      (schedule) =>
        schedule.day_name === day &&
        (schedule.time_start === time || schedule.time_end === time)
    );
    return schedule ? `${schedule.firstname} ${schedule.lastname}` : "";
  };

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure to log out?");
    if (confirmLogout) {
      sessionStorage.removeItem("saId");
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
              <Nav.Link href="apply-leave"className="text-light">
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
          <h2>Schedule</h2>
          <Table striped bordered hover>
            <thead className="text-center">
              <tr>
                <th className="bg-light align-middle">Time</th>
                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className={`align-middle ${
                      isDayScheduled(day) ? "bg-success text-white" : "bg-light"
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td className="align-middle fw-bold">{time}</td>
                  {daysOfWeek.map((day) => (
                    <td
                      key={`${day}-${time}`}
                      style={{
                        backgroundColor:
                          isStartTime(day, time) || isEndTime(day, time)
                            ? "orange"
                            : "white",
                      }}
                    >
                      {(isStartTime(day, time) || isEndTime(day, time)) && (
                        <div className="small">
                          {getFullNameForSchedule(day, time)}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
