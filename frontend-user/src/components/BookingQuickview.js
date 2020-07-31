import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { differenceInDays } from 'date-fns';
import PaymentDetails from '../components/PaymentDetails';
import CondoImage from '../images/condo-small.jpg';
import './BookingQuickview.css';

export default function BookingQuickview({ startDate, endDate, className = "", ...props }) {
  return (
    <div className={`BookingQuickview ${className}`} {...props}>
      <Row>
        <Col xs={7}>
          <h4 className="mt-0 font-weight-bold">Neverland Retreat</h4>
          <p>Entire condominium</p>
        </Col>
        <Col xs={5}>
          <Image src={CondoImage} fluid />
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
          <PaymentDetails startDate={startDate} endDate={endDate} />
          <hr />
          <h4 className="mt-0 font-weight-bold">Cancellation Policy</h4>
          {(differenceInDays(startDate, new Date()) > 7)
            ? <p>Free cancellation up to 7 days before check-in.</p>
            : <p>Free cancellation up to 24 hours before check-in.</p>
          }
        </Col>
      </Row>
    </div>
  );
}
