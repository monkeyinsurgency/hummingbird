import React, { Component } from 'react';
import CropSelector from './CropSelector';

class YieldPanel extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>{this.props.currentField}</h2>
        <CropSelector
          currentField={this.props.currentField}
        />
      </div>
    );
  }
}

export default YieldPanel;
