const initialState = {
    isLoggedIn: false,
    sessionId: 4
};

// A reducer is used to update the central state (store) of your application
// Components will dispatch actions to the store, hence the "action" attribute
// The reducer will be linked to redux in the index.js file via the createStore function, and this is how the reducer get access to the central store (global state)
// The reducer will check which action is should perform and do it - update the state correctly and return the updated state to the store
// If none of the actions it is listening for was requested it simply returns the current, unchanged state
const reducer = (state = initialState, action) => {
    // component set the action.type inside their mapDispatchToProps
    switch(action.type) {
        // TODO remove the action as it's ust temprary for testing
        case 'SWITCH_STATE':
            return {
                ...state,
                isLoggedIn: !state.isLoggedIn
            };
        case 'SET_LOGGED_IN':
            return {
                ...state,
                isLoggedIn: action.newState
            };
        default:
            return state;
    }
};

export default reducer;