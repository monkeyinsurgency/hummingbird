import React, { Component } from 'react';
import HBMap from './components/HBMap';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './css/roboto.css';

class App extends Component {
  render() {
    return (
      <HBMap/>
    );
  }
}

export default App;
