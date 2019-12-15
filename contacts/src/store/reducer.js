import axios from "../axios-contacts";

const initialState = {
    foo: "bar",
    isLoggedIn: false,
    auth: {
        userId: null,
        sessionId: null,
        accessToken: null,
        accessTokenExpiry: null,
        refreshToken: null,
        refreshTokenExpiry: null
    }

};

const setLoggedIn = (state, action) => {
    let authData = {
        ...state.auth,
        userId              : action.payload.userId,
        sessionId           : action.payload.sessionId,
        accessToken         : action.payload.accessToken,
        accessTokenExpiry   : action.payload.accessTokenExpiry,
        refreshToken        : action.payload.refreshToken,
        refreshTokenExpiry  : action.payload.refreshTokenExpiry
    };
    localStorage.setItem('userId', action.payload.userId);
    localStorage.setItem('sessionId', action.payload.sessionId);
    localStorage.setItem('accessToken', action.payload.accessToken);
    localStorage.setItem('accessTokenExpiry', action.payload.accessTokenExpiry);
    localStorage.setItem('refreshToken', action.payload.refreshToken);
    localStorage.setItem('refreshTokenExpiry', action.payload.refreshTokenExpiry);
    return {
        ...state,
        isLoggedIn: true,
        auth: authData
    };
};

const setLoggedOut = (state, action) => {
    let authData = {
        ...state.auth,
        userId: null,
        sessionId : null,
        accessToken: null,
        accessTokenExpiry: null,
        refreshToken: null,
        refreshTokenExpiry: null
    };
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiry');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiry');
    return {
        ...state,
        isLoggedIn: false,
        auth: authData
    };
};


const tryAutoLogin = (state, action) => {
    let userId = localStorage.getItem('userId');
    let sessionId = localStorage.getItem('sessionId');
    let accessToken = localStorage.getItem('accessToken');
    let accessTokenExpiry = localStorage.getItem('accessTokenExpiry');
    let refreshToken = localStorage.getItem('refreshToken');
    let refreshTokenExpiry = localStorage.getItem('refreshTokenExpiry');
    let isLoggedIn = true;

    if (!sessionId) return state;

    const expiryTime = new Date(accessTokenExpiry);
    const nowTime = new Date();
    if (nowTime > expiryTime) {
        axios.delete(
            '/api/session/' + sessionId,
            { headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                }}
        ).catch(error => {
            console.error(error.response.data.messages);
        });
        userId = null;
        sessionId = null;
        accessToken = null;
        accessTokenExpiry = null;
        refreshToken = null;
        refreshTokenExpiry = null;
        isLoggedIn = false
        localStorage.removeItem('userId');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenExpiry');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshTokenExpiry');
    }

    let authData = {
        ...state.auth,
        userId              : userId,
        sessionId           : sessionId,
        accessToken         : accessToken,
        accessTokenExpiry   : accessTokenExpiry,
        refreshToken        : refreshToken,
        refreshTokenExpiry  : refreshTokenExpiry
    };

    return {
        ...state,
        isLoggedIn: isLoggedIn,
        auth: authData
    };
};

// A reducer is used to update the central state (store) of your application
// Components will dispatch actions to the store, hence the "action" attribute
// The reducer will be linked to redux in the index.js file via the createStore function, and this is how the reducer get access to the central store (global state)
// The reducer will check which action is should perform and do it - update the state correctly and return the updated state to the store
// If none of the actions it is listening for was requested it simply returns the current, unchanged state
const reducer = (state = initialState, action) => {
    // component set the action.type inside their mapDispatchToProps
    switch(action.type) {
        case 'SET_LOGGED_OUT'   : return setLoggedOut(state, action);
        case 'SET_LOGGED_IN'    : return setLoggedIn(state, action);
        case 'TRY_AUTO_LOGIN'   : return tryAutoLogin(state, action);
        default:
            return state;
    }
};

export default reducer;