import React from "react";
import { Link } from 'react-scroll';

export default function ScrollspyLink({ classes, ...props }) {
  return (
    <Link spy={true} smooth={true} isDynamic={true} duration={500} offset={-50} activeClass="active" {...props}>
      {props.children}
    </Link>
  );
}
