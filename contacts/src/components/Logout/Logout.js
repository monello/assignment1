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
            '/api/session/' + this.props.sessionId,
            { headers: {
                'Content-Type': 'application/json',
                'Authorization': 'NjdlOWRhNDQzYWIwOGEyNWZkNTc0ZmJlNzNiNGUwZDUxMzQzODgyMjhmOTQ4ZDFlMTU3NjM2MDU2Ng=='
            }}
        ).then(response => {
            this.props.onToggleLoggedIn(false);
        }).catch(error => {
            this.setState({error: error.response.data.messages});
            console.error(error.response.data.messages);
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
        sessionId: state.sessionId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleLoggedIn: (state) => dispatch({type: 'SET_LOGGED_IN', newState: state})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);