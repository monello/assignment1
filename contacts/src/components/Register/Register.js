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
import axios from '../../axios-contacts';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            first_name: '',
            last_name: ''
        };
    }

    componentDidMount() {
        fetch('/api/user/46')
            .then(res => res.json())
            .then(users => console.log(users))
            .catch(error => console.log(error));
    }

    handleSubmit = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        console.log(this.state);
        // const data = {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //         username        : "morne.louw012",
        //         email           : "test012@gmail.com",
        //         password        : "P@ssword123",
        //         first_name      : "First Name",
        //         last_name       : "TestLName",
        //         date_of_birth   : "1952-12-09",
        //         gender          : "Male",
        //         country_id      : "167"
        //     })
        // };
        axios.post(
            '/api/user',
            {
                username        : "morne.louw014",
                email           : "test014@gmail.com",
                password        : "P@ssword123",
                first_name      : "First Name",
                last_name       : "TestLName",
                date_of_birth   : "1952-12-09",
                gender          : "Male",
                country_id      : "167"
            },
            { headers: { 'Content-Type': 'application/json' } }
        ).then(response => {
            const data = response.data.data;
            console.log("Response: ", data)
        }).catch(error => {
            console.log("ERROR:", error);
        });
        // fetch('/api/user', data)
        //     .then(response => {
        //         console.log("RESPONSE: ", response.json());
        //     })
        //     .then(data => console.log(data))
        //     .catch(error => {
        //        console.log(error)
        //     });
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <MDBContainer>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard>
                            <MDBCardBody>
                                <form
                                    className="needs-validation"
                                    onSubmit={this.handleSubmit}
                                    noValidate
                                >
                                    <p className="h4 text-center py-4">Register</p>
                                    <div className="grey-text">
                                        <MDBInput
                                            label="Your First Name"
                                            icon="user"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            name="first_name"
                                            onChange={this.handleChange}
                                            required
                                        />
                                        <div className="valid-feedback">Looks good!</div>
                                        <MDBInput
                                            label="Your Last Name"
                                            icon="user"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            name="last_name"
                                            onChange={this.handleChange}
                                            required
                                        />
                                        <div className="valid-feedback">Looks good!</div>
                                        <small id="emailHelp" className="form-text text-muted">
                                            We'll never share your email with anyone else.
                                        </small>
                                        <MDBInput
                                            label="Your email"
                                            icon="envelope"
                                            group
                                            type="email"
                                            validate
                                            error="wrong"
                                            success="right"
                                            name="email"
                                            onChange={this.handleChange}
                                            required
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
                                            onChange={this.handleChange}
                                            required
                                        />
                                        <MDBInput
                                            label="Your Username"
                                            icon="signature"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            name="username"
                                            onChange={this.handleChange}
                                            required
                                        />
                                        <MDBInput
                                            label="Your password"
                                            icon="lock"
                                            group
                                            type="password"
                                            validate
                                            name="password"
                                            onChange={this.handleChange}
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
        )
    };
};

export default Register;
