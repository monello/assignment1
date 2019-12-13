import React from 'react';
import {Nav} from "react-bootstrap";
import {NavLink} from 'react-router-dom';
import {withRouter} from 'react-router-dom';

const MenuItems = (props) => {
    let menuItems = [];
    if (props.logged_in) {
        menuItems = [
            {href: '/', label: 'Contacts'},
            {href: '/profile', label: 'Profile'},
            {href: '/logout', label: 'Logout'}
        ];
    } else {
        if (props.match.path === '/' && props.match.isExact) {
            menuItems = [{href: '/login', label: 'Login'}]
        } else {
            menuItems = [{href: '/', label: 'Register'}]
        }
    }
    const navLinks = menuItems.map((menuItem) => <NavLink key={menuItem.label} to={menuItem.href} exact className="nav-link">{menuItem.label}</NavLink>);
    return (
        <Nav>
            {navLinks}
        </Nav>
    );
};

export default withRouter(MenuItems);
