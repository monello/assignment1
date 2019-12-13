import React, { Component } from "react";
import BrandName from "../BrandName/Brandname";
import MenuItems from "../MenuItens/MenuItems";
import {
    MDBNavbar,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBCollapse,
    MDBContainer, MDBNavLink, MDBNavItem
} from "mdbreact";
import { withRouter} from 'react-router-dom';

class HeaderBar extends Component {
    state = {
        isOpen: false
    };

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    render() {
        return (
            <MDBNavbar color="default-color" dark expand="md">
                <MDBContainer>
                    <BrandName/>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem active={this.props.location.pathname === '/' ? 'active' : ''}>
                                <MDBNavLink to="/" exact className="nav-link">Home</MDBNavLink>
                            </MDBNavItem>
                        </MDBNavbarNav>
                        <MDBNavbarNav right>
                            <MenuItems logged_in={this.props.logged_in}/>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        );
    }
}

export default withRouter(HeaderBar);
