import React from 'react';
import {Nav} from "react-bootstrap";
import {NavLink} from 'react-router-dom';

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
        menuItems.logged_id.map((menuItem) => <NavLink key={menuItem.label} to={menuItem.href} exact className="nav-link">{menuItem.label}</NavLink>) :
        menuItems.logged_out.map((menuItem) => <NavLink key={menuItem.label} to={menuItem.href} exact className="nav-link">{menuItem.label}</NavLink>);
    return (
        <Nav>
            {navLinks}
        </Nav>
    );
};

export default MenuItems;
