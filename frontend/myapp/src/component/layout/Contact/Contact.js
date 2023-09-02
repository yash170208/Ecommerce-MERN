import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:mymailforyashg0099po@gmail.com">
        <Button>Contact: mymailforyashg0099po@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;