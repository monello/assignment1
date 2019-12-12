import React, {Component} from 'react';
import HeaderBar from "../../components/HeaderBar/HeaderBar";

class Layout extends Component{
    render() {
        return (
            <React.Fragment>
                <HeaderBar logged_in={this.props.logged_in}/>
                <main>{this.props.children}</main>
            </React.Fragment>
        )
    }
}

export default Layout;