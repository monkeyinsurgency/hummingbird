import React, {Component} from 'react';
import { FetchData } from '../services/FetchData';
import mapboxgl from 'mapbox-gl';
import YieldPanel from "./YieldPanel";
import { Camelise } from "../services/Functions";

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
    this.setState({
      lat: parseFloat(farm.centre.coordinates[0]),
      lng: parseFloat(farm.centre.coordinates[1]),
      bulk: farm,
      fieldies: farm.fields,
      currentField: 'Please click on a field.'
    });
  }

  async componentDidMount() {
    await this.getFarmData();

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

    let layersList = [];

    thisMap.on('load', () => {
      thisMap.addSource('fields', {
        type: "geojson",
          data: {
          type: "FeatureCollection",
          features: fields
        }
      });

      fields.forEach(thisField => {
        if (thisField.geometry.type === "Polygon") {
          let thisId = Camelise(thisField.properties.name);
          layersList.push(thisId);
          thisMap.addLayer({
            id: thisId,
            type: "fill",
            source: "fields",
            paint: {
              "fill-color": "#888888",
              "fill-opacity": 0.2,
              "fill-outline-color": "#000000",
              "fill-antialias": true
            }
          })
        }
      });

      thisMap.addLayer({
        id: "fieldsBase",
        type: "circle",
        source: "fields",
        paint: {
          "circle-radius": 6,
          "circle-color": "#B42222"
        },
        filter: ["==", "$type", "Point"]
      });
    });

    thisMap.on('click', (e) => {
      let features = thisMap.queryRenderedFeatures(e.point, { layers: layersList });
      let thisFeature = features.filter((feature) => feature.layer.id === Camelise(feature.properties.name));
      this.setState({
        currentField: thisFeature[0].properties.name
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
          </div>
        </div>
      </div>
    )
  }

}

export default HBMap;
