import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { CardElement, injectStripe } from 'react-stripe-elements';
import LoaderButton from './LoaderButton';
import { useFormFields } from '../libs/formsLib';
import './BillingForm.css';

function BillingForm({ isLoading, onSubmit, ...props }) {
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    email: "",
    guests: "",
    comments: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  
  isLoading = isProcessing || isLoading;
  
  function validateForm() {
    return (
      fields.name !== '' &&
      fields.storage !== '' &&
      isCardComplete
    );
  }
  
  async function handleSubmitClick(event) {
    event.preventDefault();
    
    setIsProcessing(true);
    
    const { token, error } = await props.stripe.createToken({ name: fields.name });
    
    setIsProcessing(false);
    
    onSubmit(fields.storage, { token, error });
  }
  
  return (
    <Form className="BillingForm" onSubmit={handleSubmitClick}>
      <Form.Group controlId="email">
        <Form.Label className="font-weight-bold">Email Address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={fields.email} onChange={handleFieldChange} />
        <Form.Text className="text-muted">Only used for confirmation and reminder emails.</Form.Text>
      </Form.Group>
      <Form.Group controlId="guests">
        <Form.Label className="font-weight-bold">Guests</Form.Label>
        <Form.Control type="number" min="1" placeholder="How many guests?" value={fields.guests} onChange={handleFieldChange}  />
        <Form.Text className="text-muted">The condo can comfortably accommodate 6 guests.</Form.Text>
      </Form.Group>
      <Form.Group controlId="name">
        <Form.Label className="font-weight-bold">Cardholder&apos;s name</Form.Label>
        <Form.Control type="text" value={fields.name} onChange={handleFieldChange} placeholder="Name on the card" />
      </Form.Group>
      <Form.Label className="font-weight-bold">Credit Card Info</Form.Label>
      <CardElement
        className="card-field"
        onChange={e => setIsCardComplete(e.complete)}
      />
      <Form.Group controlId="comments">
        <Form.Label className="font-weight-bold">Comments</Form.Label>
        <Form.Control as="textarea" maxLength="300" placeholder="Say hi to your hosts. Is there anything we should know?" value={fields.comments} onChange={handleFieldChange}  />
      </Form.Group>
      <LoaderButton block type="submit" size="large" isLoading={isLoading} disabled={!validateForm()}>Purchase</LoaderButton>
    </Form>
  );
}

export default injectStripe(BillingForm);
