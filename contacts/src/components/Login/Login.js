import React, {Component} from 'react';
// connect is used to connect components to our central Redux store (global state) and allows each component to get access to it's own slice of the global state
// this is done in the component export
import {connect} from 'react-redux';
import axios from "../../axios-contacts";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import Alert from "../UI/Alert/Alert";

// TODO generate an apiKey to ensure that only this app can send requests to the Restful API
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                username: {value: '', valid: false},
                password: {value: '', valid: false}
            },
            error: '',
            alertHidden: true,
            alertMessage: ''
        };
    }

    // TODO Add data-validation
    handleSubmit = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        // Build Submit Payload
        const submitData = {
            username        : this.state.fields.username,
            password        : this.state.fields.password
        };
        axios.post(
            '/api/session',
            submitData,
            { headers: { 'Content-Type': 'application/json' } }
        ).then(response => {
            const data = response.data.data;
            // set the global logged in status
            const payload = {
                sessionId           : data.user.session_id,
                accessToken         : data.user.access_token,
                userId              : data.user.user_id,
                accessTokenExpiry   : data.user.access_token_expiry,
                refreshToken        : data.user.refresh_token,
                refreshTokenExpiry  : data.user.refresh_token_expiry
            };
            this.props.onToggleLoggedIn(payload);
            //navigate to the Profile page
            this.props.history.push({pathname: '/profile'});
        }).catch(error => {
            if (parseInt(error.response.data.statusCode) === 401) {
                this.setState({alertHidden: false, alertMessage: error.response.data.messages});
            } else {
                this.setState({error: error.response.data.messages});
            }
        });
    };

    handleInputChange = event => {
        // Handle two-way binding - Update Immutably
        const updatedFields = {...this.state.fields};
        updatedFields[event.target.name] = event.target.value;
        this.setState({ fields: updatedFields });
    };

    formBody = () => (
        <MDBContainer className="mt-4">
            <MDBRow center>
                <MDBCol md="6">
                    <Alert heading="Oops, something went wrong" type="danger" isHidden={this.state.alertHidden}><p>{this.state.alertMessage}</p></Alert>
                    <MDBCard>
                        <MDBCardBody>
                            <form
                                className="needs-validation"
                                onSubmit={this.handleSubmit}
                                noValidate
                            >
                                <p className="h4 text-center py-4">Login</p>
                                <div className="grey-text">
                                    <MDBInput
                                        label="Your Username or Enail Address"
                                        icon="signature"
                                        group
                                        type="text"
                                        validate
                                        error="wrong"
                                        success="right"
                                        name="username"
                                        value={this.state.fields.username.value}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                    <MDBInput
                                        label="Your password"
                                        icon="lock"
                                        group
                                        type="password"
                                        validate
                                        name="password"
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="text-center py-4 mt-3">
                                    <MDBBtn color="cyan" type="submit">
                                        Submit <MDBIcon far icon="paper-plane" className="ml-1" />
                                    </MDBBtn>
                                </div>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );

    render() {
        let formContent = this.state.error ?
            <Alert heading="Oops, something went wrong" type="danger"><p>{this.state.error}</p></Alert>:
            this.formBody();

        return <React.Fragment>{formContent}</React.Fragment>
    };
}

// this function will map the parts of the global state (Redux store) to the props of this component
// this will thereby give the component access (albeit indirectly) to specific parts of the store
const mapStateToProps = state => {
    return {
        // left side is what it will be called inside the component eg. this.props.isLoggedIn
        // right side must must match the name of this property in the global state (store)
        isLoggedIn: state.isLoggedIn,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleLoggedIn: (payload) => dispatch({type: 'SET_LOGGED_IN', payload: payload})
    }
};

// connect needs to know 2 things:
// - what slice from the global state does this component need access to
// - which actions does this component want to dispatch (functions that can do updates to the store inside the reducers)
export default connect(mapStateToProps, mapDispatchToProps)(Login);