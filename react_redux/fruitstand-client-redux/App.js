import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './assets/fruit.png';
import './assets/App.css';
import { fetchInventory } from './redux/actions';

// Helpers
import price from './helpers/price';


class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchInventory());
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>React Fruitstand</h1>
          <section>
            {this.props.inventory.map(fruit =>
              <div key={fruit.id}>
                <p>{fruit.name} - {price(fruit.price)}</p>
              </div>
            )}
          </section>
        </header>
      </div>
    );
  }
}

const mapStateToProps = ({inventory}) => {
  return { inventory }
};

export default connect(mapStateToProps)(App);

