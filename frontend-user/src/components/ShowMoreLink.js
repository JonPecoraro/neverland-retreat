import React from "react";
import { Button } from 'react-bootstrap';
import './ShowMoreLink.css';

export default function ShowMoreLink({ num = 0, what = "", className = "", ...props }) {
  return (
    <Button variant="link" key="link-container" className={`ShowMoreLink text-white ${className}`} {...props}>
      Show {num > 0 ? num : ''} more {what}
    </Button>
  );
}
