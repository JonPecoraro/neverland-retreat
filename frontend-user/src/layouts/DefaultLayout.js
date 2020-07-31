import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem, Container } from 'react-bootstrap';
import { Link, animateScroll as scroll } from 'react-scroll';
import ScrollspyLink from '../components/ScrollspyLink';
import { AppContext } from '../libs/contextLib';
import { onError } from '../libs/errorLib';
import logo from '../images/logo.png';
import Routes from '../Routes';

export default function DefaultLayout() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState('');
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
  }
  
  function scrollToTop() {
    scroll.scrollToTop();
    setExpanded(false);
  }
  
  function handleNavScroll(event) {
    const element = event.srcElement.body;
    if (element && element.getBoundingClientRect().top < -100) {
      setScrolled('navbar-scrolled');
    } else {
      setScrolled('');
    }
  }
  
  window.addEventListener('scroll', handleNavScroll);
  
  return (
    <>
      {location.pathname === '/' ? (
        <Navbar collapseOnSelect fixed="top" expand="lg" expanded={expanded} className={scrolled} id="mainNav">
            <Container>
                <Navbar.Brand>
                  <Link className="navbar-brand" to="#" onClick={scrollToTop}>
                    <img className="img" src={logo} alt="Neverland Retreat logo" width="25px" />&nbsp;
                    Neverland Retreat
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} />
                <Navbar.Collapse>
                    <Nav className="ml-auto my-2 my-lg-0">
                        <NavItem><ScrollspyLink className="nav-link" onClick={() => setExpanded(false)} to="about-condo">Condo</ScrollspyLink></NavItem>
                        <NavItem><ScrollspyLink className="nav-link" onClick={() => setExpanded(false)} to="about-community">Community</ScrollspyLink></NavItem>
                        <NavItem><ScrollspyLink className="nav-link" onClick={() => setExpanded(false)} to="reservations">Reservations</ScrollspyLink></NavItem>
                        <NavItem><ScrollspyLink className="nav-link" onClick={() => setExpanded(false)} to="contact">Contact</ScrollspyLink></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
      ) : (
        <Navbar collapseOnSelect expand="lg" expanded={expanded} id="mainNav">
            <Container fluid>
                <Navbar.Brand>
                  <Link className="navbar-brand" to="/">
                    <img className="img" src={logo} alt="Neverland Retreat logo" width="25px" />
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} />
                <Navbar.Collapse>
                    <Nav className="ml-auto my-2 my-lg-0 float-left">
                        <LinkContainer to="/payments/review"><NavItem>Review booking</NavItem></LinkContainer>
                        <span> &nbsp; &rarr; &nbsp; </span>
                        <LinkContainer to="/payments/details"><NavItem>Additional details</NavItem></LinkContainer>
                        <span> &nbsp; &rarr; &nbsp; </span>
                        <LinkContainer to="/payments/completion"><NavItem>Confirm and pay</NavItem></LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
      )}
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes />
      </AppContext.Provider>
    </>
  );
}
