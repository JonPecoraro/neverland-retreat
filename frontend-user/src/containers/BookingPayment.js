import React, { useState, useRef, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { API } from 'aws-amplify';
import BillingForm from '../components/BillingForm';
import BookingQuickview from '../components/BookingQuickview';
import querystring from '../libs/querystringLib';
import { onError } from '../libs/errorLib';
import config from '../config';
import '../themes/user-theme.css'
import './BookingPayment.css';

export default function BookingPayment() {
  const [isLoading, setIsLoading] = useState(true);
  const [stripe, setStripe] = useState(null);
  
  const checkinDate = useRef(null);
  const checkoutDate = useRef(null);
  
  useEffect(() => {
    checkinDate.current = new Date(querystring('checkin'));
    checkoutDate.current = new Date(querystring('checkout'));
    setStripe(window.Stripe(config.STRIPE_KEY));
    setIsLoading(false);
  }, []);
  
  function billUser(details) {
    return API.post("neverland-retreat", "/billing", {
      body: details
    });
  }
  
  async function handleSubmit(event, { token, error }) {
    if (error) {
      onError(error);
      return;
    }
    
    setIsLoading(true);
    
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setIsLoading(false);
      return;
    }
    
    try {
      await billUser({
        event,
        source: token.id
      });
      
      alert("Your card has been charged successfully!");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  return (
    <div className="bookingPayment">
      <section className="page-section">
        <div className="container">
          <h2>Additional Details</h2>
          <Row className="mt-5">
            <Col lg={8}>
              <StripeProvider stripe={stripe}>
                <Elements>
                  <BillingForm isLoading={isLoading} onSubmit={handleSubmit} />
                </Elements>
              </StripeProvider>
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
