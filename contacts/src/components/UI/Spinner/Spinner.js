import React from "react";

import './Spinner.css';
import {MDBContainer} from "mdbreact";

const Spinner = (props) => {
    const classes = props.type ? 'spinner-grow text-' + props.type : 'spinner-grow text-info';
    return (
        <MDBContainer>
            <div className="mx-auto">
                <div className="Spinner">
                    <div className={classes} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </MDBContainer>
    );
};

export default Spinner;