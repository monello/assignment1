import React, {Component} from 'react';
import {MDBBtn, MDBCard, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import axios from "../../axios-contacts";
import Spinner from "../../components/UI/Spinner/Spinner";
import Alert from "../../components/UI/Alert/Alert";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: '',
            fields: {
                username: "Username:",
                full_name: "Name:",
                email: "Email:",
                date_of_birth: "Date of Birth:",
                country: "Country:",
                gender: "Gender:"
            },
            data: {
                username: "monello",
                full_name: "Morne Louw",
                email: "louw.morne@gmail.com",
                date_of_birth: "1974-08-24",
                country: "South Africa",
                gender: "Male"
            },
            phone_numbers: [
                {
                    id: 1,
                    user_id: 46,
                    country_code: "hdhddh",
                    number: "ghdgdgh",
                    phone_number: "072 731 2930",
                    type: "1",
                    nymber_type: "Mobile",
                    is_primary: true
                },
                {
                    id: 2,
                    value: "021 123 1111",
                    type: "Work",
                    is_primary: false
                },
                {
                    id: 3,
                    value: "021 123 2222",
                    type: "Home",
                    is_primary: false
                }
            ]
        };
    }

    componentDidMount = () => {
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');
        axios.get('/api/user/' + userId,
            { headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            } })
            .then(response => {
                console.log(response.data.data.users);
                let userData = response.data.data.users[0];
                let contactNumbers = response.data.data.users.contact_numbers;
                console.log(userData);
                console.log(contactNumbers);
                let updatedState = {
                    ...this.state,
                    data: userData,
                    phone_numbers: contactNumbers,
                    loading: false,
                    error: ''
                };
                this.setState(updatedState);
            })
            .catch(error => {
                this.setState({loading: false, error: 'Could not fetch the User data'})
            });
    };

    renderFieldRow = (label, value) => <div key={label}>
        <MDBRow>
            <MDBCol md="4">
                <p><strong>{label}</strong></p>
            </MDBCol>
            <MDBCol md="8">
                <p>{value}</p>
            </MDBCol>
        </MDBRow>
    </div>;

    renderPhoneRow = (id, number_type, phone_number, is_primary) => <div key={id}>
        <MDBRow>
            <MDBCol md="4">
                <p><strong>{number_type}</strong></p>
            </MDBCol>
            <MDBCol md="8">
                <p>{phone_number} {is_primary ? '(Primary)' : ''} <a href="#!"><MDBIcon icon="trash" size="lg" className="red-text ml-3" /></a> <a href="#1"><MDBIcon icon="pencil-alt" size="lg" className="light-blue-text ml-3" /></a></p>
            </MDBCol>
        </MDBRow>
    </div>;

    pageBody = () => {
        const fieldKeys = Object.keys(this.state.fields);
        const personalDetails = [];
        fieldKeys.forEach((item, index) => {
            let label = this.state.fields[item];
            let value = this.state.data[item];
            personalDetails.push(this.renderFieldRow(label, value));
        });
        const phoneDetails = [];
        this.state.phone_numbers.forEach((item, index) => {
            let id = this.state.phone_numbers[index].id;
            let phone_number = this.state.phone_numbers[index].phone_number;
            let number_type = this.state.phone_numbers[index].number_type;
            let is_primary = this.state.phone_numbers[index].is_primary;
            phoneDetails.push(this.renderPhoneRow(id, number_type, phone_number, +is_primary));
        });
        return (
            <MDBContainer>
                <MDBRow center>
                    <MDBCol md="8">
                        <MDBCard>

                            <MDBContainer>
                                <MDBRow>
                                    <MDBCol>
                                        <h2>Personal Details</h2>
                                    </MDBCol>
                                </MDBRow>
                                {personalDetails}
                            </MDBContainer>

                            <MDBContainer>
                                <MDBRow>
                                    <MDBCol>
                                        <div className="py-4">
                                            <MDBBtn color="cyan" type="submit">
                                                Edit <MDBIcon far icon="edit" className="ml-1" />
                                            </MDBBtn>
                                        </div>
                                    </MDBCol>
                                </MDBRow>
                            </MDBContainer>

                            <MDBContainer>
                                <MDBRow>
                                    <MDBCol>
                                        <h2>Contact Details</h2>
                                    </MDBCol>
                                </MDBRow>
                                {phoneDetails}
                            </MDBContainer>

                            <MDBContainer>
                                <MDBRow>
                                    <MDBCol>
                                        <div className="py-4">
                                            <MDBBtn color="cyan" type="submit">
                                                Add <MDBIcon far icon="plus-square" className="ml-1" />
                                            </MDBBtn>
                                        </div>
                                    </MDBCol>
                                </MDBRow>
                            </MDBContainer>

                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    };

    render() {
        let formContent = this.state.loading ? <Spinner type="warning"/> : this.pageBody();
        if (this.state.error) {
            formContent = <Alert heading="Oops, something went wrong" type="danger"><p>{this.state.error}</p></Alert>;
        }
        return <React.Fragment>{formContent}</React.Fragment>
    }
}

export default Profile;