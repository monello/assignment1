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
import './Profile.css';

class Profile extends Component {
    // COMPONENT LIFECYCLE
    // --------------------------------------------------

    constructor(props) {
        super(props);
        this.state = {
            edit_modal: false,
            add_modal: false,
            confirm_modal: false,
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
            touched: {},
            deleteNumber: {
                id: null,
                number: ''
            },
            activePhone: {
                id: '',
                country_code: '',
                number: '',
                type: '',
                is_primary: false
            }
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
                let numberVisibilityMap = {};
                contactNumbers.forEach((number,index) => {
                    numberVisibilityMap[number.id] = 'contactNumberRow visible';
                });
                let updatedState = {
                    ...this.state,
                    data: userData,
                    phone_numbers: contactNumbers,
                    loading: false,
                    numberVisibilityMap: numberVisibilityMap,
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

        axios.get('/api/list/phonetypes')
            .then(response => {
                const number_types = response.data.data.phonetypes;
                this.setState({
                    ...this.state,
                    number_types: number_types,
                    loading: false,
                    error: ''
                })
            })
            .catch(error => {
                this.setState({loading: false, error: 'Could not fetch the Number Types List'})
            });
    };

    // CRUD HANDLERS
    // --------------------------------------------------

    handleSubmit = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');
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
        axios.put(
            '/api/user/' + userId,
            submitData,
            { headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            } }
        ).then(response => {
            const data = response.data.data;
            // clean out the touched data
            this.setState({touched: {}});
            this.toggleEditModal();
        }).catch(error => {
            this.setState({error: error.response.data.messages});
        });
    };

    handlePhoneSubmit = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');
        // Build Submit Payload
        const submitData = {
            country_code    : this.state.activePhone.country_code,
            number          : this.state.activePhone.number,
            type            : this.state.activePhone.type,
            is_primary      : !!+this.state.activePhone.is_primary
        };
        if (this.state.activePhone.id) {
            axios.put(
                '/api/user/' + userId + '/contactnumber/' + this.state.activePhone.id,
                [submitData],
                { headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken
                    } }
            ).then(response => {
                const data = response.data.data;
                // clean out the touched data
                this.setState({
                    touched: {},
                    activeNumber: {
                        id: '',
                        country_code: '',
                        number: '',
                        type: '',
                        is_primary: false
                    }
                });
                this.toggleAddEditPhoneModal();
            }).catch(error => {
                this.setState({error: error.response.data.messages});
            });
        } else {
            axios.post(
                '/api/user/' + userId + '/contactnumber',
                [submitData],
                { headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken
                    } }
            ).then(response => {
                const data = response.data.data;
                // clean out the touched data
                this.setState({
                    touched: {},
                    activeNumber: {
                        id: '',
                        country_code: '',
                        number: '',
                        type: '',
                        is_primary: false
                    }
                });
                this.toggleAddEditPhoneModal();
            }).catch(error => {
                this.setState({error: error.response.data.messages});
            });
        }

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

    handlePhoneInputChange = event => {
        // Handle two-way binding - Update Immutably
        const updatedFields = {...this.state.activePhone};
        const touchedFields = {...this.state.touched};
        // touch the current field
        if (!touchedFields[event.target.name]) {
            touchedFields[event.target.name] = this.state.activePhone[event.target.name];
        }
        if (event.target.name === 'is_primary') {
            updatedFields['is_primary'] = !this.state.activePhone.is_primary
        } else {
            updatedFields[event.target.name] = event.target.value;
        }
        this.setState({ ...this.state, activePhone: updatedFields, touched: touchedFields });
    };

    handleDateChange = date => {
        // // Handle two-way binding - Update Immutably
        // const updatedFields = {...this.state.data};
        // updatedFields["date_of_birth"] = date;
        // this.setState({...this.state, data: updatedFields });
    };

    handleDeleteNumber = () => {
        const deleteNumber = this.state.deleteNumber;
        axios.delete(
            deleteNumber.uri,
            { headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('accessToken')
                } }
        ).then(response => {
            const data = response.data.data;
            let numberVisibilityMap = {...this.state.numberVisibilityMap};
            numberVisibilityMap[deleteNumber.id] = "contactNumberRow hidden";
            this.setState({numberVisibilityMap: numberVisibilityMap});
            this.toggleConfirmModal();
        }).catch(error => {
            // this.setState({error: error.response.data.messages});
            this.toggleConfirmModal();
        });
    };

    // INTERACTIONS
    // --------------------------------------------------

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

    toggleAddEditPhoneModal = () => {
        this.setState({
            add_modal: !this.state.add_modal
        });
    };

    showAddEditPhoneModal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const uri = event.target.parentElement.getAttribute('href');
        const id = uri.split('/').pop();
        const numberObj = this.state.phone_numbers.filter(number => id === number.id);
        this.setState({
            add_modal: true,
            activePhone: {
                uri: uri,
                id: numberObj[0].id,
                country_code: numberObj[0].country_code,
                number: numberObj[0].number,
                type: parseInt(numberObj[0].type),
                is_primary: numberObj[0].is_primary
            }
        });
    };

    showConfirmModal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const uri = event.target.parentElement.getAttribute('href');
        const id = uri.split('/').pop();
        const numberObj = this.state.phone_numbers.filter(number => id === number.id);
        this.setState({
            confirm_modal: true,
            deleteNumber: {
                id: numberObj[0].id,
                uri: uri,
                number: numberObj[0].country_code + ' ' + numberObj[0].number
            }
        });
    };

    toggleConfirmModal = () => {
        this.setState({
            confirm_modal: !this.state.confirm_modal,
            deleteNumber: {
                id: null,
                uri: null,
                number: null
            }
        });
    };

    // CONTENT GENERATION
    // --------------------------------------------------

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

    renderPhoneRow = (id, number_type, phone_number, is_primary) => {
        const userId = localStorage.getItem("userId");
        const link = '/api/user/' + userId + '/contactnumber/' + id;
        return(
            <div key={id} className={this.state.numberVisibilityMap[id]}>
                <MDBRow>
                    <MDBCol md="4">
                        <p><strong>{number_type}</strong></p>
                    </MDBCol>
                    <MDBCol md="8">
                        <p>{phone_number} {is_primary ? '(Primary)' : ''}
                            <a href={link} onClick={this.showConfirmModal}><MDBIcon icon="trash" size="1x" className="red-text ml-3" /></a>
                            <a href={link} onClick={this.showAddEditPhoneModal}><MDBIcon  icon="pencil-alt" size="1x" className="light-blue-text ml-2" /></a>
                        </p>
                    </MDBCol>
                </MDBRow>
            </div>
        );
    };

    editFormBody = () => {
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

    phoneFormBody = () => {
        return (
            <React.Fragment>
                <form
                    className="needs-validation"
                    noValidate
                >
                    <div className="grey-text">
                        <MDBInput
                            label="Country Code"
                            icon="globe-africa"
                            group
                            type="text"
                            validate
                            error="wrong"
                            success="right"
                            name="country_code"
                            value={this.state.activePhone.country_code}
                            onChange={this.handlePhoneInputChange}
                            required
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <MDBInput
                            label="Number"
                            icon="phone"
                            group
                            type="text"
                            validate
                            error="wrong"
                            success="right"
                            name="number"
                            value={this.state.activePhone.number}
                            onChange={this.handlePhoneInputChange}
                            required
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <SelectInput
                            name="type"
                            required={true}
                            onChange={this.handlePhoneInputChange}
                        >
                            <SelectOptions
                                placeholder="Type of Number"
                                options={this.state.number_types}
                                selected={this.state.activePhone.type}
                            />
                        </SelectInput>
                        <div>
                            <div className="custom-control custom-checkbox">
                                <input
                                    name="is_primary"
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="is_primary"
                                    checked={this.state.activePhone.is_primary}
                                    onChange={this.handlePhoneInputChange}
                                />
                                <label className="custom-control-label" htmlFor="is_primary">Primary Number</label>
                            </div>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    };

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
                                                <MDBBtn className="ml-0" onClick={this.toggleAddEditPhoneModal} color="teal" type="submit">
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
                    <MDBModal isOpen={this.state.edit_modal} toggle={this.toggleEditModal}>
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
                    <MDBModal isOpen={this.state.add_modal} toggle={this.toggleAddEditPhoneModal}>
                        <MDBModalHeader toggle={this.toggleAddEditPhoneModal}>Update Phone Number</MDBModalHeader>
                        <MDBModalBody>
                            {this.phoneFormBody()}
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="amber"onClick={this.handlePhoneSubmit}>Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>

                <MDBContainer>
                    <MDBModal isOpen={this.state.confirm_modal} toggle={this.toggleConfirmModal} centered>
                        <MDBModalHeader toggle={this.toggleConfirmModal}>Delete Number</MDBModalHeader>
                        <MDBModalBody>
                            <p>Are you sure you want to delete this number?</p>
                            <h3>{this.state.deleteNumber.number}</h3>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="grey" onClick={this.toggleConfirmModal}>Cancel</MDBBtn>
                            <MDBBtn color="red" onClick={this.handleDeleteNumber}>Yes, Delete it</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
            </React.Fragment>
        )
    };

    // RENDER
    // --------------------------------------------------

    render() {
        let formContent = this.state.loading ? <Spinner type="warning"/> : this.pageBody();
        if (this.state.error) {
            formContent = <Alert heading="Oops, something went wrong" type="danger"><p>{this.state.error}</p></Alert>;
        }
        return <React.Fragment>{formContent}</React.Fragment>
    }
}

export default Profile;