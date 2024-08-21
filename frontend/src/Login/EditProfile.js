import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

const EditProfile = () => {
  const navigate = useNavigate();
  const [frm, setFrm] = useState({
    fname: "",
    lname: "",
    hostel: "",
    room: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
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
          setFrm((prevFrm) => ({
            ...prevFrm,
            fname: data.user.firstname,
            lname: data.user.lastname,
            hostel: data.user.hostel,
            room: data.user.room,
            email: data.user.email,
          }));
        })
        .catch((error) => {
          setError("Error fetching user data");
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFrm((prevFrm) => ({ ...prevFrm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (frm.newPassword !== frm.confirmPassword) {
      toast.warning("New password and confirm password do not match");
      return;
    }

    fetch(`${apiUrl}/api/user/updateprofile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(frm),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Profile updated successfully") {
          toast.success("Profile updated successfully!");
          navigate("/edit");
        } else {
          toast.warning("Error updating profile");
        }
      })
      .catch((error) => {
        toast.error("Error updating profile");
      });
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8} lg={6}>
          <h1 className="text-center mb-4">Edit Profile</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="fname" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="fname"
                value={frm.fname}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="lname" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lname"
                value={frm.lname}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="hostel" className="mb-3">
              <Form.Label>Hostel</Form.Label>
              <Form.Control
                as="select"
                name="hostel"
                value={frm.hostel}
                onChange={handleChange}
                required
              >
                <option value="">Select a hostel</option>
                <option value="hostel1">Hostel 1</option>
                <option value="hostel2">Hostel 2</option>
                <option value="hostel3">Hostel 3</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="room" className="mb-3">
              <Form.Label>Room</Form.Label>
              <Form.Control
                type="number"
                name="room"
                value={frm.room}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={frm.email}
                onChange={handleChange}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="currentPassword" className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={frm.currentPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={frm.newPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={frm.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Update Profile
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
