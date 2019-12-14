import React, {Component} from 'react';
import axios from '../../axios-contacts';
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
import SelectInput from "../UI/SelectInput/SelectInput";
import SelectOptions from "../UI/SelectInput/SelectOptions/SelectOptions";
import CustomDatePicker from "../UI/CustomDatePicker/CustomDatePicker";
import Spinner from "../UI/Spinner/Spinner";
import Alert from "../UI/Alert/Alert";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                first_name: 'Morne',
                last_name: 'Louw',
                email: 'louw.morne@gmail.com',
                confirm_email: 'louw.morne@gmail.com',
                username: 'mornelouw',
                password: 'Password',
                date_of_birth: '',
                gender: 'Male',
                country_id : 167
            },
            loading: true,
            countries: [],
            error: ''
        };
        this.genders = [
            {id: 'Male', label: 'Male'},
            {id: 'Female', label: 'Female'},
            {id: 'Other', label: 'Other'}
        ];
    }

    componentDidMount() {
        axios.get('/api/list/countries')
            .then(response => {
                const countries = response.data.data.countries;
                this.setState({
                    countries: countries,
                    loading: false,
                    error: ''
                })
            })
            .catch(error => {
                this.setState({loading: false, error: 'Could not fetch the Countries List'})
            });
    }

    // TODO Add data-validation
    handleSubmit = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        // Reformat Date of Birth
        let date_of_birth = this.state.fields.date_of_birth.toLocaleDateString("zh-Hans-CN");
        let [year, month, day] =  date_of_birth.split('/');
        month = month.length < 2 ? '0' + month : month;
        day = day.length < 2 ? '0' + day : day;
        date_of_birth = [year,month,day].join('-');
        // Build Submit Payload
        const submitData = {
            first_name      : this.state.fields.first_name,
            last_name       : this.state.fields.last_name,
            email           : this.state.fields.email,
            username        : this.state.fields.username,
            password        : this.state.fields.password,
            date_of_birth   : date_of_birth,
            gender          : this.state.fields.gender,
            country_id      : this.state.fields.country_id
        };
        console.log("Submit Data:", submitData); // TODO remove this when done
        axios.post(
            '/api/user',
            submitData,
            { headers: { 'Content-Type': 'application/json' } }
        ).then(response => {
            const data = response.data.data;
            console.log("Data: ", data); // TODO Remove this when done
            //navigate to the Log-in page
            this.props.history.push({pathname: '/login'});
        }).catch(error => {
            this.setState({error: error.response.data.messages});
            console.error(error.response.data.messages);
        });
    };

    handleInputChange = event => {
        // Handle two-way binding - Update Immutably
        const updatedFields = {...this.state.fields};
        updatedFields[event.target.name] = event.target.value;
        this.setState({ fields: updatedFields });
    };

    handleDateChange = date => {
        // Handle two-way binding - Update Immutably
        const updatedFields = {...this.state.fields};
        updatedFields["date_of_birth"] = date;
        this.setState({ fields: updatedFields });
    };

    formBody = () => (
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
                                        value={this.state.fields.first_name}
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
                                        value={this.state.fields.last_name}
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
                                        value={this.state.fields.email}
                                        onChange={this.handleInputChange}
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
                                        name="confirm_email"
                                        value={this.state.fields.confirm_email}
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
                                        value={this.state.fields.username}
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
                                    <CustomDatePicker
                                        name="date_of_birth"
                                        placeholder="Your Date of Birth"
                                        selectedDate={this.state.fields.date_of_birth}
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
                                            selected={this.state.fields.gender}
                                        />
                                    </SelectInput>
                                    <SelectInput
                                        name="country_id"
                                        required={true}
                                        onChange={this.handleInputChange}
                                        selected={this.state.fields.country_id}
                                    >
                                        <SelectOptions
                                            placeholder="Your Country"
                                            options={this.state.countries}
                                        />
                                    </SelectInput>
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
        let formContent = this.state.loading ? <Spinner type="warning"/> : this.formBody();
        if (this.state.error) {
            formContent = <Alert heading="Oops, something went wrong" type="danger"><p>{this.state.error}</p></Alert>;
        }
        return <React.Fragment>{formContent}</React.Fragment>
    };
};

export default Register;
