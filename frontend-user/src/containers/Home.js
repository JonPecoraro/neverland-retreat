import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth, API, Storage } from 'aws-amplify';
import { Row, Col, ListGroup, Form, Toast } from 'react-bootstrap';
import { format } from 'date-fns';
import ShowMore from '../components/ShowMoreLink';
import LoaderButton from '../components/LoaderButton';
import ScrollspyLink from '../components/ScrollspyLink';
import ReservationForm from '../components/ReservationForm';
import config from '../config';
import { onError } from '../libs/errorLib';
import { useFormFields } from '../libs/formsLib';
import { useAppContext } from "../libs/contextLib";
import '../themes/user-theme.css'
import './Home.css';

export default function Home() {
  const history = useHistory();
  const { isAuthenticated, userHasAuthenticated } = useAppContext();
  
  const [condoImages, setCondoImages] = useState([]);
  const [communityImages, setCommunityImages] = useState([]);
  const [condoAmenities, setCondoAmenities] = useState([]);
  const [communityAmenities, setCommunityAmenities] = useState([]);
  const [calendars, setCalendars] = useState([]);
  
  const [showAllCondoImages, setShowAllCondoImages] = useState(false);
  const [showAllCommunityImages, setShowAllCommunityImages] = useState(false);
  const [showAllCondoAmenities, setShowAllCondoAmenities] = useState(false);
  const [showAllCommunityAmenities, setShowAllCommunityAmenities] = useState(false);
  
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    questions: "",
    protection: ""
  });
  
  useEffect(() => {
    async function onLoad() {
      try {
        if (!isAuthenticated) {
          await Auth.signIn(config.cognito.WEBSITE_USER, config.cognito.PASS);
          userHasAuthenticated(true);
        }
        
        const images = await loadImages();
        images.map(async (image) => {
          const imageUrl = await Storage.vault.get(image.imageUrl);
          image.imageUrl = imageUrl;
        });
        setCondoImages(images.filter(image => image.type === 'condo'));
        setCommunityImages(images.filter(image => image.type === 'community'));
        
        const amenities = await loadAmenities();
        setCondoAmenities(amenities.filter(amenity => amenity.type === 'condo'));
        setCommunityAmenities(amenities.filter(amenity => amenity.type === 'community'));
        
        const calendars = await loadCalendars();
        setCalendars(calendars);
      } catch(e) {
        onError(e);
      }
    }
    
    onLoad();
    // eslint-disable-next-line
  }, []);
  
  function loadImages() {
    return API.get('neverland-retreat', '/images');
  }
  
  function loadAmenities() {
    return API.get('neverland-retreat', '/amenities');
  }
  
  function loadCalendars() {
    return API.get('neverland-retreat', '/calendars');
  }
  
  function handleReservationSubmit(checkinDate, checkoutDate) {
    const formattedCheckin = format(checkinDate, 'MM-dd-yyyy');
    const formattedCheckout = format(checkoutDate, 'MM-dd-yyyy');
    history.push(`/payments?checkin=${formattedCheckin}&checkout=${formattedCheckout}`);
  }
  
  function renderAmenities(amenityList, numberToRender = -1) {
    return amenityList.map((amenity, i) =>
        (numberToRender === -1 || i < numberToRender) &&
        <div key={amenity.sk} className="col-lg-3 col-md-6 text-center">
            <div className="mt-5">
                <i className={'fas fa-4x fa-' + amenity.icon + ' mb-4'}></i>
                <h3 className="h4 mb-2">{amenity.amenityName}</h3>
                <p className="text-white-75 mb-0">{amenity.description}</p>
            </div>
        </div>
      );
  }
  
  function renderImages(imageList, numberToRender = -1) {
    return imageList.map((image, i) =>
      (numberToRender === -1 || i < numberToRender) &&
      <div key={image.sk} className="col-lg-4 col-sm-6">
          <a className="picture-box" href={image.imageUrl}>
              <img className="img-fluid" src={image.imageUrl} alt={image.imageName} />
              <div className="picture-box-caption">
                  <div className="project-category text-white-50">{image.imageName}</div>
                  <div className="project-name">{image.description}</div>
              </div>
          </a>
      </div>
    );
  }
  
  function handleContactSubmit(event) {
    setIsSubmittingContact(true);
    event.preventDefault();
    
    if (fields.protection) {
      setShowSubmitMessage(true);
      return;
    }
    
    console.log(fields.email);
    console.log(fields.questions);
    console.log(fields.protection);
    setShowSubmitMessage(true);
  }
  
  return (
    <div className="home">
      {/* Masthead */}
      <header className="masthead">
          <div className="container h-100">
              <div className="row h-100 align-items-center justify-content-center text-center">
                  <div className="col-lg-10 align-self-end">
                      <h1 className="text-uppercase text-white font-weight-bold">Neverland Retreat</h1>
                      <h2 className="text-white font-weight-light mb-5">Your dream Disney vacation starts here!</h2>
                  </div>
                  <div className="col-lg-8 align-self-baseline">
                      <ScrollspyLink className="btn btn-primary btn-xl text-white" to="about-condo">Find Out More</ScrollspyLink>
                  </div>
              </div>
          </div>
      </header>
      {/* About the condo */}
      <section className="page-section bg-primary text-white has-gallery" id="about-condo">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                      <h2 className="mt-0">We've got what you need!</h2>
                      <p className="text-white-75 mb-4">
                        Neverland Retreat offers a fun filled getaway for the whole family. This 3 bed 2 bath condo is located in the Windsor Hills community,
                        just a few miles away from Disney World. The condo is on the 3rd floor and is accessible by elevator or stairs. The space comes fully
                        equipped with everything you’ll need to make your stay easy and comfortable. When you’re not out enjoying the parks, our community has
                        an abundance of amenities to keep the family entertained. It's just a short walk to the community's resort style pool.
                      </p>
                      {condoAmenities.length > 0 && (
                        <>
                          <h3 className="mt-0">Condo Amenities</h3>
                          <div className="row">
                              {renderAmenities(condoAmenities, 4)}
                              {showAllCondoAmenities ? renderAmenities(condoAmenities.slice(4)) : ''}
                              {
                                (condoAmenities.length > 4 && !showAllCondoAmenities) &&
                                <ShowMore
                                  num={condoAmenities.length - 4}
                                  what="amenities"
                                  onClick={() => setShowAllCondoAmenities(true)}
                                />
                              }
                          </div>
                        </>
                      )}
                      <ScrollspyLink className="btn btn-light btn-xl text-dark mt-5" to="about-community">Explore the Community!</ScrollspyLink>
                  </div>
              </div>
          </div>
          {/* Condo pictures */}
          <div className="photo-gallery">
              <div className="container-fluid p-0">
                  <div className="row no-gutters">
                      {renderImages(condoImages, 6)}
                      {showAllCondoImages ? renderImages(condoImages.slice(6)) : ''}
                      {
                        (condoImages.length > 6 && !showAllCondoImages) &&
                        <ShowMore
                          num={condoImages.length - 6}
                          what="images"
                          onClick={() => setShowAllCondoImages(true)}
                        />
                      }
                  </div>
              </div>
          </div>
      </section>
      {/* About the community */}
      <section className="page-section bg-dark text-white has-gallery" id="about-community">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                      <h2 className="mt-0">You can't beat the community!</h2>
                      <p className="text-white-75 mb-4">
                        Windsor Hills is a unique vacation rental community. They are dedicated to providing safe, comfortable,
                        and enjoyable environment centered around family fun. The location is great for families visiting top
                        attractions including Disney World, Universal Studios Florida, Sea World, Gatorland and more! The
                        community comes fully packed with amenities for the whole family to enjoy.
                      </p>
                      {communityAmenities.length > 0 && (
                        <>
                          <h3 className="mt-0">Community Amenities</h3>
                          <div className="row">
                              {renderAmenities(communityAmenities, 4)}
                              {showAllCommunityAmenities ? renderAmenities(communityAmenities.slice(4)) : ''}
                              {
                                (communityAmenities.length > 4 && !showAllCommunityAmenities) && 
                                <ShowMore
                                  num={communityAmenities.length - 4}
                                  what="amenities"
                                  onClick={() => setShowAllCommunityAmenities(true)}
                                />
                              }
                          </div>
                        </>
                      )}
                      <ScrollspyLink className="btn btn-primary btn-xl mt-5" to="reservations">Book a Stay!</ScrollspyLink>
                  </div>
              </div>
          </div>
          {/* Community pictures */}
          <div className="photo-gallery">
              <div className="container-fluid p-0">
                  <div className="row no-gutters">
                      {renderImages(communityImages, 6)}
                      {showAllCommunityImages ? renderImages(communityImages.slice(6)) : ''}
                      {
                        (communityImages.length > 6 && !showAllCommunityImages) &&
                        <ShowMore
                          num={communityImages.length - 6}
                          what="images"
                          onClick={() => setShowAllCommunityImages(true)}
                        />
                      }
                  </div>
              </div>
          </div>
      </section>
      {/* Reservations */}
      {calendars.length > 0 &&
        <section className="page-section bg-primary" id="reservations">
            <div className="container text-center">
              <Row>
                <Col md={6}>
                  <h2 className="mb-4 text-white">Reservation Calendar</h2>
                  <ReservationForm calendars={calendars} onSubmit={handleReservationSubmit} />
                </Col>
                <Col md={6}>
                  <h2 className="mb-4 text-white">Pricing</h2>
                  <ListGroup>
                    <ListGroup.Item>$115 per night</ListGroup.Item>
                    <ListGroup.Item>5% discount: stays longer than a week</ListGroup.Item>
                    <ListGroup.Item>25% discount: stays longer than a month</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </div>
        </section>
      }
      {/* Contact */}
      <section className="page-section" id="contact">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                      <h2 className="mt-0">Let's Get In Touch!</h2>
                      <p className="text-muted mb-5">Still have questions? We're happy to help!</p>
                  </div>
              </div>
              <div className="row">
                  <div className="col-lg-4 ml-auto text-center mb-5 mb-lg-0">
                      <i className="fas fa-envelope fa-3x mb-3 text-muted"></i>
                      <a className="d-block" href="mailto:contact@neverland-retreat.com">contact@neverland-retreat.com</a>
                  </div>
                  <div className="col-lg-4 mr-auto">
                    <Toast className="bg-success text-white" show={showSubmitMessage} onClose={() => setShowSubmitMessage(false)}>
                      <Toast.Header>
                        <strong className="mr-auto">Thank you</strong>
                      </Toast.Header>
                      <Toast.Body>We received your message and will be in touch soon!</Toast.Body>
                    </Toast>
                    <Form className="contact-form" onSubmit={handleContactSubmit}>
                      <Form.Group controlId="email">
                        <Form.Label className="font-weight-bold">Email Address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email" value={fields.email} onChange={handleFieldChange} />
                      </Form.Group>
                      <Form.Group controlId="questions">
                        <Form.Label className="font-weight-bold">Questions</Form.Label>
                        <Form.Control required as="textarea" rows="7" maxLength="500" placeholder="How can we help you?" value={fields.questions} onChange={handleFieldChange}  />
                      </Form.Group>
                      <Form.Group controlId="protection" className="d-none">
                        <Form.Label className="font-weight-bold">Protection</Form.Label>
                        <Form.Control type="text" value={fields.protection} onChange={handleFieldChange}  />
                      </Form.Group>
                      <LoaderButton block type="submit" disabled={isSubmittingContact} size="large">Send Message</LoaderButton>
                    </Form>
                  </div>
              </div>
          </div>
      </section>
      {/* Footer */}
      <footer className="bg-light py-5">
          <div className="container"><div className="small text-center text-muted">Copyright © 2020 - AJP Systems</div></div>
      </footer>
    </div>
  );
}
