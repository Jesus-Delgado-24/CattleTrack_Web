import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  return (
    <Navbar className="navbar-cafe" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {" "}
          CattleTrack
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Button variant="outline-light" as={Link} to="/login">
              Iniciar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;