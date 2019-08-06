import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from '../App';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { initialState } from '../redux/reducers/index'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore(initialState);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  div);
  ReactDOM.unmountComponentAtNode(div);
});
