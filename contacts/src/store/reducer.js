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
        sessionId           : action.payload.sessionId,
        accessToken         : action.payload.accessToken,
        userId              : action.payload.userId,
        accessTokenExpiry   : action.payload.accessTokenExpiry,
        refreshToken        : action.payload.refreshToken,
        refreshTokenExpiry  : action.payload.refreshTokenExpiry
    };
    return {
        ...state,
        isLoggedIn: true,
        auth: authData
    };
};

const setLoggedOut = (state, action) => {
    let authData = {
        ...state.auth,
        sessionId : null,
        accessToken: null,
        userId: null,
        accessTokenExpiry: null,
        refreshToken: null,
        refreshTokenExpiry: null
    };
    return {
        ...state,
        isLoggedIn: false,
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
        default:
            return state;
    }
};

export default reducer;