import React, {Component} from 'react';
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import {MDBContainer} from "mdbreact";

class Layout extends Component{
    render() {
        return (
            <React.Fragment>
                <HeaderBar logged_in={this.props.logged_in}/>
                <MDBContainer>
                    <main>{this.props.children}</main>
                </MDBContainer>
            </React.Fragment>
        )
    }
}

export default Layout;