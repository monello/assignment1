import React from 'react';

import BrandName from "../BrandName/Brandname";
import MenuItems from "../MenuItens/MenuItems";
import {Navbar, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const HeaderBar = (props) => (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <BrandName/>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Link to="/" className="nav-link">Home</Link>
            </Nav>
            <MenuItems logged_in={props.logged_in}/>
        </Navbar.Collapse>
    </Navbar>
);

export default HeaderBar;