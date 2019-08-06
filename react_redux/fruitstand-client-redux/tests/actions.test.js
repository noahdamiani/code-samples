import configureMockStore from 'redux-mock-store';
import mockdate from 'mockdate';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import { requestInventory } from '../redux/actions/index';
import { initialState } from '../redux/reducers/index'
import actionTypes from '../redux/actions/types';
import logger from 'redux-logger';
import { fetchInventory } from '../redux/actions/index';
import fruits from '../../../api/fruits.json';

const middleware = [thunk];
const mockStore = configureMockStore(middleware, logger);
const TEST_TIMESTAMP = 1434319925275;
mockdate.set(TEST_TIMESTAMP);

describe('actions', () => {

  beforeEach(function() {
    moxios.install();
  })

  afterEach(function() {
    moxios.uninstall();
  })

  it('should create an action to request new inventory', () => {
    const expectedAction = {
      type: actionTypes.REQUEST_INVENTORY
    }
    expect(requestInventory()).toEqual(expectedAction);
  })

  it('should fetch new inventory items', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: fruits
      });
    });

    const expectedActions = [
      { type: actionTypes.REQUEST_INVENTORY },
      { type: actionTypes.RECEIVE_INVENTORY, inventory: fruits.inventory, receivedAt: TEST_TIMESTAMP }
    ];

    const store = mockStore(initialState);

    return store.dispatch(fetchInventory()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
