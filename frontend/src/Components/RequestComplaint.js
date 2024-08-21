import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  Button,
  ListGroup,
  Container,
  Row,
  Col,
  ButtonGroup,
} from "react-bootstrap";
import "../Components_Css/RequestComplaints.css";
import { useUser } from "./UserContext";

const RequestComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [userId, setUserId] = useState("");
  const { user } = useUser();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      fetch(`${apiUrl}/api/user/validateToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token validation failed");
          }
          return response.json();
        })
        .then((data) => {
          if (data.user.role === "admin") {
            setUserId("admin");
          } else {
            setUserId(data.user._id);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle errors, e.g., redirect to login if token is invalid
          // navigate("/login");
        });
    }
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/reg_complaints?serviced=false&id=${userId}`
        );
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    if (userId) fetchComplaints();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/complaints/${id}`);
      setComplaints(complaints.filter((complaint) => complaint._id !== id));
      toast.success("Complaint deleted successfully!");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast.error("Error deleting complaint");
    }
  };

  const handleDone = async (id) => {
    try {
      await axios.put(`${apiUrl}/complaints/${id}`, {
        serviced: true,
      });
      setComplaints(
        complaints.map((complaint) =>
          complaint._id === id ? { ...complaint, serviced: true } : complaint
        )
      );
      toast.success("Complaint marked as serviced");
    } catch (error) {
      console.error("Error updating complaint:", error);
      toast.error("Error updating complaint");
    }
  };

  const themeClass = user === "true" ? "dark-theme" : "light-theme";
  return (
    <Container className={`container mt-4 ${themeClass}`}>
      <Card>
        <Card.Header className="card-header">
          <h4 className="mb-0">Request Complaints</h4>
        </Card.Header>
        <Card.Body>
          {complaints.length > 0 ? (
            <ListGroup>
              {complaints.map((complaint) => (
                <ListGroup.Item key={complaint._id}>
                  <Row>
                    <Col md={8}>
                      <h5>Complaint Type: {complaint.complainttype}</h5>
                      <p>
                        <strong>Description:</strong> {complaint.complaint}
                      </p>
                      <p>
                        <strong>Complaint Date:</strong>{" "}
                        {new Date(complaint.timestamp).toLocaleString()}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {complaint.serviced ? "Serviced" : "Pending"}
                      </p>
                    </Col>
                    <Col md={4} className="text-end">
                      <ButtonGroup>
                        <Button
                          variant="success"
                          onClick={() => handleDone(complaint._id)}
                          className="me-2"
                          disabled={complaint.serviced}
                        >
                          Done
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(complaint._id)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-center">No pending complaints to display.</p>
          )}
        </Card.Body>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default RequestComplaint;
