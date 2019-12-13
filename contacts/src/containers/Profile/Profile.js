import React, {Component} from 'react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 1,
            username: 'morne.louw',
            email: 'louw.morne@gmail.com',
            first_name: 'Morne',
            last_name: 'Louw',
            date_of_birth: '1974-08-24',
            gender: 'Male',
            country_id: 167
        };
    }
    render() {
        return (
            <div>Profile CONTAINER UPDATED Component</div>
        )
    }
}

export default Profile;