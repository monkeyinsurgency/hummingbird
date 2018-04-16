import React, {Component} from 'react';
import {FetchCrops} from "../services/FetchData";
import Loading from './Loading';

class CropSelector extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    selectedOption: '',
    loading: true
  };

  cropsByField = [];

  async getCrops() {
    const crops = await FetchCrops();
    let croptions = [];
    for (const [index, crop] of crops.entries()) {
      croptions.push({ value: index, label: crop.name });
    }

    this.setState({
      croptions: croptions,
      loading: false
    });
  }

  componentDidMount() {
    this.getCrops();
  }

  handleChange = (selectedOption, currentField=this.props.currentField) => {
    // ...and here's where I realise I should have used Redux.
    this.cropsByField.push({currentField:currentField, selectedOption:selectedOption});
    console.log(this.cropsByField);
  };

  render() {
    const { croptions, loading } = this.state;
      return (
        <ul className={`crop-list`}>
          { loading ? (
            <Loading />
          ) : (
              croptions.map((crop, index) =>
              <li onClick={() => this.handleChange(crop.label)} key={index}>{crop.label}</li>
            )
          )}
        </ul>
      );
    }
}

export default CropSelector;
