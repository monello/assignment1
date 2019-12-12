import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Layout from "./hoc/Layout/Layout";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import ContactsList from "./components/ContactsList/ContactsList";
import './App.css';

class App extends Component {
    state = {
        logged_in: false
    };

    handlerSwitchState = () => {
        this.setState({logged_in:  !this.state.logged_in});
    };

    render() {
        let routes = (
            <Switch>
                <Route path="/" exact component={Register} />
                <Route path="/login" component={Login} />
                <Redirect to="/" />
            </Switch>
        );
        if (this.state.logged_in) {
            routes = (
                <Switch>
                    <Route path="/" exact component={ContactsList} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/logout" component={Logout} />
                    <Redirect to="/" />
                </Switch>
            );
        }
        return (
            <div className="App gridContainer">
                <Layout logged_in={this.state.logged_in}>{routes}</Layout>
                <button onClick={this.handlerSwitchState}>Switch State</button>
            </div>
        );
    }
}

export default App;
