import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./UserContext";
import "../Components_Css/Servicedone.css";

const ServicedDone = () => {
  const { user } = useUser();
  const [complaints, setComplaints] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      fetch("http://localhost:5000/api/user/validateToken", {
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
            setUserId(data.user.role);
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
    if (userId) {
      axios
        .get(`http://localhost:5000/reg_complaints?serviced=true&id=${userId}`)
        .then((response) => {
          setComplaints(response.data);
        })
        .catch((error) => {
          console.error("Error fetching complaints:", error);
          toast.error("Error fetching complaints");
        });
    }
  }, [userId]);

  // Determine theme based on user value
  const themeClass = user === "true" ? "dark-theme" : "light-theme";

  return (
    <Container className={`container serviced-done-container ${themeClass}`}>
      <h1 className="my-2 text-center">Serviced Complaints</h1>
      {complaints.length > 0 ? (
        complaints.map((complaint) => (
          <Card
            key={complaint._id}
            className="mb-1 shadow-sm serviced-card border-light"
          >
            <Card.Header className="serviced-card-header">
              <Row>
                <Col md={8}>
                  <h5 className="mb-0">Complaint ID: {complaint._id}</h5>
                </Col>
                <Col md={4} className="text-end">
                  <Badge bg="success">Resolved</Badge>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="serviced-card-body">
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Complaint Type:</strong> {complaint.complainttype}
                  </p>
                  <p>
                    <strong>Complaint:</strong> {complaint.complaint}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Complaint Date:</strong>{" "}
                    {new Date(complaint.timestamp).toLocaleString()}
                  </p>
                  <p>
                    <strong>Resolved Date:</strong>{" "}
                    {new Date(complaint.resolvedtime).toLocaleString()}
                  </p>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-muted serviced-card-footer">
              <footer className="blockquote-footer">
                Resolved by{" "}
                <cite title="Resolver">
                  Support Team <span>{complaint.admin || "Not available"}</span>
                </cite>
              </footer>
            </Card.Footer>
          </Card>
        ))
      ) : (
        <p className="text-center">No serviced complaints to display.</p>
      )}
    </Container>
  );
};

export default ServicedDone;
