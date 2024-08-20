import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import "./styles.css"; // Import your CSS file

function HomePage() {
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
              <Nav.Link href="/login" className="nav-link-custom">
                Login
              </Nav.Link>
              <Nav.Link href="/signin" className="nav-link-custom">
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
        <button className="btn btn-primary">Get Started</button>
      </div>
    </div>
  );
}

export default HomePage;
