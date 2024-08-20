import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import "../Components_Css/MakeComplaints.css"; // Import the CSS file
// import "../Components_Css/variable.css"; // Import the variables file
import { useUser } from "./UserContext";
const MakeComplaint = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    email: "",
    complaint: "",
    complainttype: "",
    serviced: false,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        fetch("http://localhost:5000/complaints", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }),
        {
          pending: "Submitting your complaint...",
          success: "Complaint submitted successfully 👌",
          error: "Failed to submit complaint 🤯",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      setForm({
        id: form.id,
        email: form.email,
        complaint: "",
        complainttype: "",
        serviced: false,
      });

      console.log("Complaint submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit complaint.");
    }
  };

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
          setForm((prevForm) => ({
            ...prevForm,
            email: data.user.email,
            id: data.user._id,
          }));
        })
        .catch((error) => {
          console.error("Error:", error);
          navigate("/login");
        });
    }
  }, [navigate]);

  const themeClass = user === "true" ? "dark-theme" : "light-theme";

  return (
    <div className={`container mt-4 ${themeClass}`}>
      <Card className={themeClass}>
        <Card.Header className={themeClass}>Make a Complaint</Card.Header>
        <Card.Body className={themeClass}>
          <div className="mb-4">
            <p>
              <strong>Important Note:</strong>
            </p>
            <ListGroup className={themeClass}>
              <ListGroup.Item className={themeClass}>
                <strong>Write your complaint very precisely.</strong>
              </ListGroup.Item>
              <ListGroup.Item className={themeClass}>
                You can check your complaints in:
                <ul>
                  <li>
                    <strong>Request Complaints</strong>
                  </li>
                  <li>
                    <strong>Serviced Complaints</strong>
                  </li>
                </ul>
              </ListGroup.Item>
            </ListGroup>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formComplaintType" className="mt-3">
              <Form.Label>Complaint Type</Form.Label>
              <Form.Control
                as="select"
                value={form.complainttype}
                name="complainttype"
                onChange={handleChange}
              >
                <option value="">Select complaint type</option>
                <option value="hostel-room">Hostel Room</option>
                <option value="mess">Mess</option>
                <option value="canteen">Canteen</option>
                <option value="others">Others</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formComplaint">
              <Form.Label>Complaint</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Enter your complaint here"
                value={form.complaint}
                name="complaint"
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default MakeComplaint;
