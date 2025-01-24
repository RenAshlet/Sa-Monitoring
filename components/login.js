"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [alertShow, setAlertShow] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  const showAlert = (variant, message) => {
    setAlertShow({ show: true, variant, message });
    setTimeout(() => {
      setAlertShow((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const login = async () => {
    if (!username && !password) {
      showAlert("danger", "Username and Password are required");
      return;
    } else if (!username) {
      showAlert("warning", "Username is required");
      return;
    } else if (!password) {
      showAlert("warning", "Password is required");
      return;
    }

    const url = "http://localhost/nextjs/api/sa-monitoring/login.php";

    const jsonData = {
      username: username,
      password: password,
    };

    const formData = new FormData();
    formData.append("operation", "login");
    formData.append("json", JSON.stringify(jsonData));

    setLoading(true);
    try {
      const response = await axios({
        url: url,
        method: "POST",
        data: formData,
      });

      if (response.data.role) {
        const { role } = response.data;
        let params = new URLSearchParams();
        if (role === "admin") {
          showAlert("success", "Login successful");
          sessionStorage.setItem("adminId", response.data.admin_id);
          sessionStorage.setItem("firstname", response.data.firstname);
          sessionStorage.setItem("lastname", response.data.lastname);
          router.push(`/admin/dashboard ${params}`);
        } else if (role === "student-assistant") {
          showAlert("success", "Login successful");
          sessionStorage.setItem("saId", response.data.sa_id);
          sessionStorage.setItem("firstname", response.data.firstname);
          sessionStorage.setItem("lastname", response.data.lastname);
          router.push(`/student-assistant/dashboard ${params}`);
        }
      } else {
        showAlert("warning", "Invalid username or password");
      }
    } catch (error) {
      showAlert("danger", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Card
          style={{ width: "30rem" }}
          className="shadow-lg p-4 rounded text-black"
        >
          <Card.Body style={{ backgroundColor: "#ffffff" }}>
            <div className="text-center mb-3">
              <h2 className="text-[#1e0e4b] font-bold">
                SA <span className="text-[#7747ff]">Monitoring</span>
              </h2>
              <p className="text-sm text-[#1e0e4b]">Log in to your account</p>
            </div>
            <Form
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  login();
                }
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label className="text-gray-600">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  autoFocus
                  className="rounded border border-gray-200 text-black"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-gray-600">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="rounded border border-gray-200 text-black"
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={login}
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
                  "Login"
                )}
              </Button>

              {alertShow.show && (
                <Alert
                  variant={alertShow.variant}
                  onClose={() => setAlertShow({ ...alertShow, show: false })}
                  dismissible
                >
                  {alertShow.message}
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;
