import React, { Component } from 'react';
import HBMap from './components/HBMap';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

class App extends Component {
  render() {
    return (
      <HBMap/>
    );
  }
}

export default App;
