import React, {Component} from 'react';
import {FetchCrops} from "../services/FetchData";
import Select from 'react-select';

class CropSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
    };
  }

  async componentDidMount() {
    const crops = await FetchCrops();
    let croptions = [];
    for (const [index, crop] of crops.entries()) {
      croptions.push({ value: index, label: crop.name });
    }
    this.setState({
      croptions
    })
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Selected: ${selectedOption.label}`);
  };

  render() {
    const { selectedOption, croptions } = this.state;

    console.log(croptions);

    return (
      <Select
        name="cropSelector"
        value={selectedOption}
        onChange={this.handleChange}
        options={croptions}
      />
    );
  }
}

export default CropSelector;
