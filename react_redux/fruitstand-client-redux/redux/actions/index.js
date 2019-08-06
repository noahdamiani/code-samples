import actionTypes from './types';
import axios from 'axios';

export function requestInventory() {
    return {
        type: actionTypes.REQUEST_INVENTORY
    }
}

export function receiveInventory(inventory) {
    return {
        type: actionTypes.RECEIVE_INVENTORY,
        ...inventory,
        receivedAt: Date.now()
    }
}

export function fetchInventory() {
    return dispatch => {
        dispatch(requestInventory());
        return axios.get('http://localhost:4300/api/inventory')
                    .then(({data: inventory}) => dispatch(receiveInventory(inventory)));
    }
}
