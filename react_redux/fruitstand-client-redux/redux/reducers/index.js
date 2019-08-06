import actionTypes from "../actions/types";

export const initialState = {
    inventory: []
};

function rootReducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.REQUEST_INVENTORY:
            return {...state, isFetching: true };
        case actionTypes.RECEIVE_INVENTORY:
            return {...state, inventory: action.inventory, isFetching: false};
        case actionTypes.LOAD_FRUIT:
            return {...state, inventory: state.inventory.map(fruit => fruit.id === action.payload.id ? action.payload : fruit)}
        case actionTypes.ADD_FRUIT:
                return {...state, inventory: state.inventory.concat(action.payload)};
        default:
            return state;
    }
};

export default rootReducer;