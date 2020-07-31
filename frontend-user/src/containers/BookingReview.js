import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Row, Col } from 'react-bootstrap';
import { format, differenceInDays } from 'date-fns';
import config from '../config';
import LoaderButton from '../components/LoaderButton';
import BookingQuickview from '../components/BookingQuickview';
import querystring from '../libs/querystringLib';
import { onError } from '../libs/errorLib';
import { useAppContext } from '../libs/contextLib';
import '../themes/user-theme.css'
import './BookingReview.css';

export default function BookingReview() {
  const history = useHistory();
  const { isAuthenticated, userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isAgreeingToRules, setIsAgreeingToRules] = useState(false);
  
  const checkinDate = useRef(null);
  const checkoutDate = useRef(null);
  
  useEffect(() => {
    async function onLoad() {
      try {
        if (!isAuthenticated) {
          await Auth.signIn(config.cognito.WEBSITE_USER, config.cognito.PASS);
          userHasAuthenticated(true);
        }
        
        checkinDate.current = new Date(querystring('checkin'));
        checkoutDate.current = new Date(querystring('checkout'));
      } catch(e) {
        onError(e);
      }
      
      setIsLoading(false);
    }
    
    onLoad();
    // eslint-disable-next-line
  }, []);
  
  function  handleAgreementClick() {
    setIsAgreeingToRules(true);
    
    const formattedCheckin = format(checkinDate.current, 'MM-dd-yyyy');
    const formattedCheckout = format(checkoutDate.current, 'MM-dd-yyyy');
    history.push(`/payments/checkout?checkin=${formattedCheckin}&checkout=${formattedCheckout}`);
  }
  
  return (
    !isLoading &&
    <div className="bookingReview">
      <section className="page-section" id="review-booking">
        <div className="container">
          <h2>Review Booking</h2>
          <Row className="mt-5">
            <Col lg={8}>
              <h4 className="mt-0 font-weight-bold">{differenceInDays(checkoutDate.current, checkinDate.current)} night stay at Neverland Retreat</h4>
              <Row>
                <Col md={6}>
                  <div className="booking-date-display d-inline-block">
                    {format(checkinDate.current, 'MMM')} <br />
                    <span className="font-weight-bold">{format(checkinDate.current, 'dd')}</span>
                  </div>
                  <p className="d-inline-block ml-2">
                    {format(checkinDate.current, 'EEEE')} check-in <br />
                    After 4:00 PM
                  </p>
                </Col>
                <Col md={6}>
                  <div className="booking-date-display d-inline-block">
                    {format(checkoutDate.current, 'MMM')} <br />
                    <span className="font-weight-bold">{format(checkoutDate.current, 'dd')}</span>
                  </div>
                  <p className="d-inline-block ml-2">
                    {format(checkoutDate.current, 'EEEE')} checkout <br />
                    10:00 AM
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="icon-display d-inline-block">
                    <i className="fas fa-2x fa-unlock"></i>
                  </div>
                  <p className="d-inline-block ml-2">Self check-in with keypad</p>
                  <hr />
                </Col>
              </Row>
              <Row id="house-rules">
                <Col xs={12}>
                  <h4 className="mt-0 font-weight-bold">House Rules</h4>
                  <div className="icon-display d-inline-block">
                    <i className="fas fa-paw text-danger"></i>
                  </div>
                  <p className="d-inline-block ml-2">No pets</p>
                </Col>
                <Col xs={12}>
                  <div className="icon-display d-inline-block">
                    <i className="fas fa-glass-cheers text-danger"></i>
                  </div>
                  <p className="d-inline-block ml-2">No parties or events</p>
                </Col>
                <Col xs={12}>
                  <div className="icon-display d-inline-block">
                    <i className="fas fa-smoking-ban text-danger"></i>
                  </div>
                  <p className="d-inline-block ml-2">No smoking</p>
                </Col>
                <Col xs={12}>
                  <div className="icon-display d-inline-block">
                    <i className="fas fa-volume-mute text-danger"></i>
                  </div>
                  <p className="d-inline-block ml-2">Quiet hours: 11:00 PM to 7:00 AM</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <LoaderButton block variant="primary" size="large" isLoading={isAgreeingToRules} onClick={handleAgreementClick} type="button">Agree to rules</LoaderButton>
                </Col>
              </Row>
            </Col>
            <Col lg={4} id="booking-details-column">
              <BookingQuickview startDate={checkinDate.current} endDate={checkoutDate.current} />
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}
