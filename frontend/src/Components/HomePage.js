import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Login from "../Login/login";
import Signin from "../Login/Signin"; // Import Signin component
import "./styles.css";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const validateToken = (token) => {
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
        console.log("Token is valid:", data);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    console.log("useEffect - token:", token);
    if (token && login) {
      validateToken(token);
    }
  }, [login]);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: ".navbar-brand", // Highlight the brand/logo in the navbar
          popover: {
            title: "Brand",
            description: "This is the brand or logo section.",
          },
        },
        {
          element: ".navbar-nav .nav-link[href='#home']", // Highlight the Home link
          popover: {
            title: "Home Link",
            description: "This link will take you to the home page.",
          },
        },
        {
          element:
            ".navbar-nav .nav-link[href='https://charantejas.netlify.app/']", // Highlight the About Me link
          popover: {
            title: "About Me Link",
            description: "This link directs you to the About Me page.",
          },
        },
        {
          element: ".navbar-nav .nav-link[href='#feedback']", // Highlight the Feedback link
          popover: {
            title: "Feedback Link",
            description: "This link takes you to the feedback section.",
          },
        },
        {
          element: ".nav-link-custom[href='#']" // Highlight the Login link
            .replace(/\s+/g, "."),
          popover: {
            title: "Login Link",
            description: "Click this to open the Login modal.",
          },
        },
        {
          element: ".nav-link-custom[href='h']" // Highlight the Signin link
            .replace(/\s+/g, "."),
          popover: {
            title: "Signin Link",
            description: "Click this to open the Signin modal.",
          },
        },
      ],
    });

    driverObj.drive(); // Start the tour
  };

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => {
    if (localStorage.getItem("token") && !login) {
      setLogin(true);
    } else {
      setShowLogin(true);
    }
  };
  const handleLoginSuccess = () => {
    setLogin(true);
    setShowLogin(false);
  };

  const handleCloseSignin = () => setShowSignin(false);
  const handleShowSignin = () => setShowSignin(true);

  return (
    <div className="bgm">
      <Navbar className="navbar-custom" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Hostel Complaints</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="https://charantejas.netlify.app/">
                About me
              </Nav.Link>
              <Nav.Link href="#feedback">Feedback</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={handleShowLogin} className="nav-link-custom">
                Login
              </Nav.Link>
              <Nav.Link
                onClick={handleShowSignin}
                className="nav-link-custom"
                href="h"
              >
                Signin
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="main-content">
        <div className="scrolling-text">
          <h1>Welcome to the Hostel Complaint Management System</h1>
        </div>
        <p>Manage complaints efficiently and effectively.</p>
        <button className="btn btn-primary" onClick={startTour}>
          Get Started
        </button>
      </div>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onClose={handleCloseLogin} onSuccess={handleLoginSuccess} />
        </Modal.Body>
      </Modal>

      {/* Signin Modal */}
      <Modal show={showSignin} onHide={handleCloseSignin}>
        <Modal.Header closeButton>
          <Modal.Title>Signin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Signin />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default HomePage;
