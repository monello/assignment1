import React, {Component} from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBIcon
} from 'mdbreact';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'morne.louw',
            email: 'louw.morne@gmail.com',
            first_name: 'Morne',
            last_name: 'Louw'
        };
    }

    submitHandler = event => {
        event.preventDefault();
        event.target.className += " was-validated";
    };

    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <MDBContainer>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard>
                            <MDBCardBody>
                                <form className="needs-validation" onSubmit={this.submitHandler} noValidate >
                                    <p className="h4 text-center py-4">Sign up</p>
                                    <div className="grey-text">
                                        <MDBInput
                                            label="Your First Name"
                                            icon="user"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            value={this.state.first_name}
                                            name="first_name"
                                            onChange={this.changeHandler}
                                        />
                                        <MDBInput
                                            label="Your Last Name"
                                            icon="user"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            value={this.state.last_name}
                                            name="last_name"
                                            onChange={this.changeHandler}
                                        />
                                        <MDBInput
                                            label="Your email"
                                            icon="envelope"
                                            group
                                            type="email"
                                            validate
                                            error="wrong"
                                            success="right"
                                            value={this.state.email}
                                            name="email"
                                            onChange={this.changeHandler}
                                        />
                                        <MDBInput
                                            label="Confirm your email"
                                            icon="exclamation-triangle"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            name="email"
                                            onChange={this.changeHandler}
                                        />
                                        <MDBInput
                                            label="Your Username"
                                            icon="signature"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            value={this.state.username}
                                            name="username"
                                            onChange={this.changeHandler}
                                        />
                                        <MDBInput
                                            label="Your password"
                                            icon="lock"
                                            group
                                            type="password"
                                            validate
                                            name="password"
                                            onChange={this.changeHandler}
                                        />
                                    </div>
                                    <div className="text-center py-4 mt-3">
                                        <MDBBtn color="cyan" type="submit">
                                            Register <MDBIcon far icon="paper-plane" className="ml-1" />
                                        </MDBBtn>
                                    </div>
                                </form>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    };
};

export default Register;
