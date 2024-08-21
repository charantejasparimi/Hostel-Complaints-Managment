import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import DarkMode from "./DarkMode/DarkMode";
import "../Components_Css/Header.css";
// import { useUser } from "./UserContext";

const Header = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Hostel Logbuk</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="mr-auto">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/home">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/make-complaint">
              Raise Complaint
            </Nav.Link>
            <Nav.Link as={Link} to="/request-complaint">
              Request Complaint
            </Nav.Link>
            <Nav.Link as={Link} to="/serviced">
              Services Done
            </Nav.Link>
            <NavDropdown title="Profile">
              <NavDropdown.Item>
                <Nav.Link as={Link} to="/edit">
                  Edit Profile
                </Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Nav.Link as={Link} to="/forgotpassword">
                  Forgot Password
                </Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() =>
                  localStorage.removeItem("token") &&
                  localStorage.removeItem("role") &&
                  window.location.reload() &&
                  window.location.replace("/")
                }
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
            {/* <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/signin">
              Signin
            </Nav.Link> */}
          </Nav>
          <DarkMode />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
