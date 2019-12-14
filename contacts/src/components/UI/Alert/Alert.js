import React from "react";
import { MDBContainer, MDBAlert } from 'mdbreact';

import './Alert.css';

const Alert = (props) => {
    const classes = props.type ? props.type : 'warning';
    return (
        <MDBContainer>
            <MDBAlert className="Alert" color={classes}>
                <h4 className="alert-heading">{props.heading ? props.heading : <span>Please Note</span>}</h4>
                {props.children}
            </MDBAlert>
        </MDBContainer>
    );
};

export default Alert;