import React, {Component} from 'react';
import {
    MDBBtn,
    MDBCard,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBRow,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader, MDBCardBody, MDBInput
} from "mdbreact";
import axios from "../../axios-contacts";
import Spinner from "../../components/UI/Spinner/Spinner";
import Alert from "../../components/UI/Alert/Alert";
import CustomDatePicker from "../../components/UI/CustomDatePicker/CustomDatePicker";
import SelectInput from "../../components/UI/SelectInput/SelectInput";
import SelectOptions from "../../components/UI/SelectInput/SelectOptions/SelectOptions";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_modal: false,
            add_modal: false,
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
            data: {},
            phone_numbers: [],
            touched: {}
        };
        this.genders = [
            {id: 'Male', label: 'Male'},
            {id: 'Female', label: 'Female'},
            {id: 'Other', label: 'Other'}
        ];
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
                let userData = response.data.data.users[0];
                let contactNumbers = response.data.data.users.contact_numbers;
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

        axios.get('/api/list/countries')
            .then(response => {
                const countries = response.data.data.countries;
                this.setState({
                    ...this.state,
                    countries: countries,
                    loading: false,
                    error: ''
                })
            })
            .catch(error => {
                this.setState({loading: false, error: 'Could not fetch the Countries List'})
            });
    };

    handleSubmit = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');
        console.log(this.state.data);
        // Build Submit Payload
        const submitData = {
            first_name      : this.state.data.first_name,
            last_name       : this.state.data.last_name,
            email           : this.state.data.email,
            username        : this.state.data.username,
            password        : this.state.data.password,
            date_of_birth   : this.state.data.date_of_birth,
            gender          : this.state.data.gender,
            country_id      : this.state.data.country_id
        };
        console.log("Submit Data:", submitData); // TODO remove this when done
        axios.put(
            '/api/user/' + userId,
            submitData,
            { headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            } }
        ).then(response => {
            const data = response.data.data;
            console.log("Data: ", data); // TODO Remove this when done
            console.log(this.state.data);
            // clean out the touched data
            this.setState({touched: {}});
        }).catch(error => {
            this.setState({error: error.response.data.messages});
            console.error(error.response.data.messages); // TODO Remove this
        });
    };

    handleInputChange = event => {
        // Handle two-way binding - Update Immutably
        const updatedFields = {...this.state.data};
        const touchedFields = {...this.state.touched};
        // touch the current field
        if (!touchedFields[event.target.name]) {
            touchedFields[event.target.name] = this.state.data[event.target.name];
        }
        // sync the full-name in the state
        if (event.target.name === 'first_name') {
            updatedFields.full_name = event.target.value + ' ' + this.state.data.last_name;
        }
        if (event.target.name === 'last_name') {
            updatedFields.full_name = this.state.data.first_name + ' ' + event.target.value;
        }
        if (event.target.name === 'country_id') {
            const countryObj = this.state.countries.filter(country => event.target.value === country.id);
            updatedFields.country = countryObj[0].label;
        }
        updatedFields[event.target.name] = event.target.value;
        this.setState({ ...this.state, data: updatedFields, touched: touchedFields });
    };

    handleDateChange = date => {
        // // Handle two-way binding - Update Immutably
        // const updatedFields = {...this.state.data};
        // updatedFields["date_of_birth"] = date;
        // this.setState({...this.state, data: updatedFields });
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
                <p>{phone_number} {is_primary ? '(Primary)' : ''} <a href="#!"><MDBIcon icon="trash" size="1x" className="red-text ml-3" /></a> <a href="#1"><MDBIcon icon="pencil-alt" size="1x" className="light-blue-text ml-2" /></a></p>
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
            <React.Fragment>
                <MDBContainer className="mt-4">
                    <MDBRow center>
                        <MDBCol md="8">
                            <MDBCard className="px-4">

                                <MDBContainer className="pb-4">
                                    <MDBRow>
                                        <MDBCol>
                                            <h2 className="pt-4">Personal Details</h2>
                                        </MDBCol>
                                    </MDBRow>
                                    {personalDetails}
                                    <MDBRow>
                                        <MDBCol>
                                            <div className="pb-4">
                                                <MDBBtn className="ml-0" onClick={this.toggleEditModal} color="teal" type="submit">
                                                    Edit Personal Details <MDBIcon far icon="edit" className="ml-1" />
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
                                    <MDBRow>
                                        <MDBCol>
                                            <div className="pb-4">
                                                <MDBBtn className="ml-0" onClick={this.toggleAddModal} color="teal" type="submit">
                                                    Add Phone Number<MDBIcon far icon="plus-square" className="ml-1" />
                                                </MDBBtn>
                                            </div>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBContainer>

                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>


                <MDBContainer>
                    <MDBModal isOpen={this.state.edit_modal} toggle={this.toggle}>
                        <MDBModalHeader toggle={this.toggleEditModal}>Personal Details</MDBModalHeader>
                        <MDBModalBody>
                            {this.editFormBody()}
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn onClick={this.handleSubmit} color="amber">Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>


                <MDBContainer>
                    <MDBModal isOpen={this.state.add_modal} toggle={this.toggle}>
                        <MDBModalHeader toggle={this.toggleAddModal}>Add/Edit Number</MDBModalHeader>
                        <MDBModalBody>
                            (...)
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="amber">Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
            </React.Fragment>
        )
    };

    editFormBody = () => {
        // let copiedData = {...this.state.data};
        // copiedData.date_of_birth = new Date(this.state.data.date_of_birth)
        // this.setState({...this.state, data: copiedData});
        // console.log("COPIED DATA: ", copiedData);
        // copiedData.first_name = "FooBar";
        return (
            <React.Fragment>
                <form
                    className="needs-validation"
                    noValidate
                >
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
                            value={this.state.data.first_name}
                            onChange={this.handleInputChange}
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
                            value={this.state.data.last_name}
                            onChange={this.handleInputChange}
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
                            value={this.state.data.email}
                            onChange={this.handleInputChange}
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
                            value={this.state.data.username}
                            onChange={this.handleInputChange}
                            required
                        />
                        <CustomDatePicker
                            name="date_of_birth"
                            placeholder="Your Date of Birth"
                            selectedDate={new Date(this.state.data.date_of_birth)}
                            changeHandler={this.handleDateChange}
                        />
                        <SelectInput
                            name="gender"
                            required={true}
                            onChange={this.handleInputChange}
                        >
                            <SelectOptions
                                placeholder="Your Gender"
                                options={this.genders}
                                selected={this.state.data.gender}
                            />
                        </SelectInput>
                        <SelectInput
                            name="country_id"
                            required={true}
                            onChange={this.handleInputChange}
                            selected={this.state.data.country_id}
                        >
                            <SelectOptions
                                placeholder="Your Country"
                                options={this.state.countries}
                            />
                        </SelectInput>
                    </div>
                </form>
            </React.Fragment>
        )
    };

    toggleEditModal = () => {
        let updatedData = {...this.state.data};
        let touchedData = {...this.state.touched};
        if (this.state.edit_modal) {
            // reset all the values in state to what they were
            const keys = Object.keys(touchedData);
            keys.forEach((item, index) => {
                updatedData[item] = touchedData[item];
                // sync the full-name in the state
                if (item === 'first_name') {
                    if (touchedData.last_name) {
                        updatedData.full_name = touchedData.first_name + ' ' + touchedData.last_name;
                    } else {
                        updatedData.full_name = touchedData.first_name + ' ' + updatedData.last_name;
                    }
                }
                if (item === 'last_name') {
                    if (touchedData.first_name) {
                        updatedData.full_name = touchedData.first_name + ' ' + touchedData.last_name;
                    } else {
                        updatedData.full_name = updatedData.first_name + ' ' + touchedData.last_name;
                    }
                }
                if (item === 'country_id') {
                    const countryObj = this.state.countries.filter(country => touchedData.country_id === country.id);
                    updatedData.country = countryObj[0].label;
                }
            });
            // clean-out the touched fields
            touchedData = {};
        }
        this.setState({
            ...this.state,
            edit_modal: !this.state.edit_modal,
            data: updatedData,
            touched: touchedData
        });
    };
    toggleAddModal = () => {
        this.setState({
            add_modal: !this.state.add_modal
        });
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