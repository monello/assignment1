import React from 'react';
import {Link} from 'react-router-dom';
import {MDBNavbarBrand} from "mdbreact";

const BrandName = (props) => (
    <MDBNavbarBrand>
        <Link to="/" className="navbar-brand">Contacts App</Link>
    </MDBNavbarBrand>
);

export default BrandName;