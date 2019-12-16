import React, {Component} from 'react';
import {connect} from 'react-redux'
import axios from '../../axios-contacts';
import Spinner from "../UI/Spinner/Spinner";
import Alert from "../UI/Alert/Alert";

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    componentDidMount() {
        axios.delete(
            '/api/session/' + this.props.authData.sessionId,
            { headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.authData.accessToken
            }}
        ).then(response => {
            this.props.onLoggedOut();
        }).catch(error => {
            this.setState({error: error.response.data.messages});
        });
    }

    render() {
        let content = <Spinner type="warning"/>;
        if (this.state.error) {
            content = <Alert heading="Oops, something went wrong" type="danger"><p>{this.state.error}</p></Alert>;
        }
        return <React.Fragment>{content}</React.Fragment>
    };
}

const mapStateToProps = state => {
    return {
        authData: state.auth
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onLoggedOut: () => dispatch({type: 'SET_LOGGED_OUT'})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);