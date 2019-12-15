import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Layout from "./hoc/Layout/Layout";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import Register from "./components/Register/Register";
import Profile from "./containers/Profile/Profile";
import Contacts from "./containers/Contacts/Contacts";
import './App.css';

class App extends Component {
    render() {
        let routes = (
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/register" exact component={Register} />
                <Route path="/login" component={Login} />
                <Redirect to="/" />
            </Switch>
        );
        if (this.props.isLoggedIn) {
            routes = (
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/contacts" exact component={Contacts} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/logout" component={Logout} />
                    <Redirect to="/" />
                </Switch>
            );
        }
        return (
            <div className="App gridContainer">
                <Layout logged_in={this.props.isLoggedIn}>{routes}</Layout>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn
    }
};

export default connect(mapStateToProps)(App);
