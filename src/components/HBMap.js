import React, {Component} from 'react';
//import ReactDom from 'react-dom';
import { FetchData, FetchCrops } from '../services/FetchData';
import mapboxgl from 'mapbox-gl';
import YieldPanel from "./YieldPanel";
import CropSelector from "./CropSelector";

mapboxgl.accessToken = 'pk.eyJ1IjoibW9ua2V5aW5zdXJnZW5jeSIsImEiOiJjamYzNWZ0dWQwcDlrMnFxeHdsemZhb2EyIn0.IlSSeFKXEW5CNv9uEOZqKw';

class HBMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: 0,
      lat: 0
    };
  }

  async getFarmData() {
    const farm = await FetchData();
    console.log('farmy', farm)
    this.setState({
      lat: parseFloat(farm.centre.coordinates[0]),
      lng: parseFloat(farm.centre.coordinates[1]),
      bulk: farm,
      fieldies: farm.fields,
      currentField: 'Please click on a field.'
    });
  }

  async getCropData() {
    const crops = await FetchCrops();
    console.log('croppyfirst', crops);
  }

  testingThis = (name) => {
    this.setState({
      currentField: name,
      slappy: 'Slappy'
    })
    console.log(this.state);
  }

  async componentDidMount() {
    await this.getFarmData();
    await this.getCropData();

    const { lng, lat, fieldies, currentField } = this.state;

    let thisMap = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lat, lng],
      zoom: 13
    });

    let fields = [{
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lat, lng]
      }
    }];

    for (let field of fieldies) {

      for (let theseCoordinates of field.boundary.coordinates) {
        theseCoordinates.map(item => {
          return [item[0], item[1]];
        });

        let thisField = {
          type: "Feature",
          properties: {
            name: field.name,
            disease_susceptibility: field.disease_susceptibility,
            hectares: field.hectares,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              theseCoordinates
            ]
          }
        };

        fields.push(thisField);
      }
    }

    thisMap.on('click', 'fieldsBoundaries', (e) => {

      let thisName = e.features[0].properties.name;
      this.testingThis(thisName);


    });

    thisMap.on('load', () => {
      thisMap.addSource('fields', {
        type: 'geojson',
          data: {
          type: "FeatureCollection",
          features: fields
        }
      });

      thisMap.addLayer({
        "id": "fieldsBoundaries",
        "type": "fill",
        "source": "fields",
        "paint": {
          "fill-color": "#888888",
          "fill-opacity": 0.4
        },
        "filter": ["==", "$type", "Polygon"]
      });

      thisMap.addLayer({
        "id": "fieldsBase",
        "type": "circle",
        "source": "fields",
        "paint": {
          "circle-radius": 6,
          "circle-color": "#B42222"
        },
        "filter": ["==", "$type", "Point"],
      });



    });
  }

  render() {
    return (
      <div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        <div className="map-overlay">
          <div className="map-overlay-inner">
            <YieldPanel
              currentField={this.state.currentField}
            />
            <CropSelector
              allCrops={this.state.crop}
            />
          </div>
        </div>
      </div>
    )
  }

}

export default HBMap;
