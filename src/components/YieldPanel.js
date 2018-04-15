import React, { Component } from 'react';

class YieldPanel extends Component {

  constructor(props) {
    super(props);
    console.log('yieldy', this.props);
  }

  componentDidMount() {
    console.log('yieldState', this.state)
  }

  render() {
    return (
      <div>{this.props.currentField}</div>
    );
  }
}

export default YieldPanel;
