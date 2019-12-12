import React from 'react';
import {Nav} from "react-bootstrap";
import {Link} from 'react-router-dom';

const MenuItems = (props) => {
    const logged_in = props.logged_in;
    const menuItems = {
        'logged_id': [
            {href: '/', label: 'Contacts'},
            {href: '/profile', label: 'Profile'},
            {href: '/logout', label: 'Logout'}
        ],
        'logged_out': [
            {href: '/login', label: 'Login'}
        ]
    };
    let navLinks = logged_in ?
        menuItems.logged_id.map((menuItem) => <Link key={menuItem.label} to={menuItem.href} className="nav-link">{menuItem.label}</Link>) :
        menuItems.logged_out.map((menuItem) => <Link key={menuItem.label} to={menuItem.href} className="nav-link">{menuItem.label}</Link>);
    return (
        <Nav>
            {navLinks}
        </Nav>
    );
};

export default MenuItems;
