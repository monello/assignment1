import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import {createStore} from "redux";
import App from './App';
import * as serviceWorker from './serviceWorker';
import reducer from "./store/reducer";
import {Provider} from 'react-redux';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import './index.css';

// create our central store, hook up the reducer(s) that will manipulate the store via actions the components pas to it
// we do this all in the application root file (this index.php) because the want to hook up the store to our global
// We use the package called 'react-redux' to (as the name suggests, connect react and redux (our application to the central store/state)
// This is done with the Provider
const store = createStore(reducer);

const app = (
    <Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>
);
ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


