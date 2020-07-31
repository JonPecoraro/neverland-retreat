import React from 'react';
import { Button, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { differenceInDays } from 'date-fns';
import PriceCalculator from '../libs/pricingLib';
import './PaymentDetails.css';

export default function PaymentDetails({ startDate, endDate, className = "", ...props }) {
  const costCalculator = PriceCalculator(startDate, endDate);
  
  const taxInfo = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Tax Information</Popover.Title>
      <Popover.Content>
        <div>
          <p>
            <u>
              <a className="text-dark" href="https://floridarevenue.com/Forms_library/current/gt800034.pdf" target="_blank" rel="noopener noreferrer">Florida: 6%</a>
            </u>
          </p>
          <p>
            <u>
              <a className="text-dark" href="https://floridarevenue.com/Forms_library/current/dr15tdt.pdf" target="_blank" rel="noopener noreferrer">Osceola County: 6%</a>
            </u>
          </p>
          <p>
            <u>
              <a className="text-dark" href="http://dor.myflorida.com/Forms_library/current/gt800034.pdf" target="_blank" rel="noopener noreferrer">Learn more</a>
            </u>
          </p>
        </div>
      </Popover.Content>
    </Popover>
  );
  
  return (
    <div className={`PaymentDetails ${className}`} {...props}>
      <Table>
        <tbody>
          <tr>
            <td>${costCalculator.basePrice} x {differenceInDays(endDate, startDate)} nights</td>
            <td className="text-right">
              <NumberFormat
                value={costCalculator.calculateBaseCost()}
                displayType="text"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="$"
              />
            </td>
          </tr>
          {costCalculator.getDiscountText().length > 0 &&
            <tr>
              <td>{costCalculator.getDiscountText()}</td>
              <td className="text-right text-success font-weight-bold">
                <NumberFormat
                  value={costCalculator.calculateDiscountTotal()}
                  displayType="text"
                  thousandSeparator={true}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix="-$"
                />
              </td>
            </tr>
          }
          <tr>
            <td>Cleaning fee</td>
            <td className="text-right">${costCalculator.cleaningFee}</td>
          </tr>
          <tr>
            <td>
              <OverlayTrigger trigger="click" overlay={taxInfo}>
                <Button id="tax-info-link" variant="link">Occupancy taxes</Button>
              </OverlayTrigger>
            </td>
            <td className="text-right">
              <NumberFormat
                value={costCalculator.calculateTaxes()}
                displayType="text"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="$"
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2"><hr /></td>
          </tr>
          <tr>
            <td className="font-weight-bold">Total</td>
            <td className="text-right font-weight-bold">
              <NumberFormat
                value={costCalculator.calculateTotalCost()}
                displayType="text"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="$"
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}
