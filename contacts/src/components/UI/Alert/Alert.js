import React from "react";
import { MDBContainer, MDBAlert } from 'mdbreact';

import './Alert.css';

const Alert = (props) => {
    const color = props.type ? props.type : 'warning';
    let classes = 'Alert';
    if (props.isHidden) {
        classes = classes + ' hidden';
    }
    return (
        <MDBContainer>
            <MDBAlert className={classes} color={color}>
                <h4 className="alert-heading">{props.heading ? props.heading : <span>Please Note</span>}</h4>
                {props.children}
            </MDBAlert>
        </MDBContainer>
    );
};

export default Alert;