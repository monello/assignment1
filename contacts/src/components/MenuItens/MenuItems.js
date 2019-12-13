import React from 'react';
import {MDBNavItem, MDBNavLink} from "mdbreact";
import {withRouter} from 'react-router-dom';

const MenuItems = (props) => {
    let menuItems = [];
    if (props.logged_in) {
        menuItems = [
            {href: '/contacts', label: 'Contacts'},
            {href: '/profile', label: 'Profile'},
            {href: '/logout', label: 'Logout'}
        ];
    } else {
        if (props.location.pathname === '/register') {
            menuItems = [{href: '/login', label: 'Login'}];
        } else if(props.location.pathname === '/login') {
            menuItems = [{href: '/register', label: 'Register'}];
        } else {
            menuItems = [
                {href: '/register', label: 'Register'},
                {href: '/login', label: 'Login'}
            ];
        }
    }
    const navLinks = menuItems.map((menuItem) => {
        const isActive = props.location.pathname === menuItem.href ? 'active' : '';
        return(
            <MDBNavItem active={isActive}>
                <MDBNavLink key={menuItem.label} to={menuItem.href} exact className="nav-link">{menuItem.label}</MDBNavLink>
            </MDBNavItem>
        )
    });
    return (
        <React.Fragment>
            {navLinks}
        </React.Fragment>
    )
};

export default withRouter(MenuItems);
