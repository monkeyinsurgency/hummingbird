import React, {Component} from 'react';
//import ReactDom from 'react-dom';
import { FetchData } from '../services/FetchData';
import mapboxgl from 'mapbox-gl';
import data from '../css/map.geojson';

mapboxgl.accessToken = 'pk.eyJ1IjoibW9ua2V5aW5zdXJnZW5jeSIsImEiOiJjamYzNWZ0dWQwcDlrMnFxeHdsemZhb2EyIn0.IlSSeFKXEW5CNv9uEOZqKw';

class HBMap extends Component {
  map;
  state = {
    lng: 0,
    lat: 0
  };

  originalState;

  constructor(props: Props) {
    super(props);
  }


  async getDashData() {
    const result = await FetchData();
    this.setState({
      lat: parseFloat(result.centre.coordinates[0]),
      lng: parseFloat(result.centre.coordinates[1]),
      bulk: result,
      fieldies: result.fields
    });

    console.log('bulky', JSON.stringify(this.state.bulk));

  }
  // componentWillMount() {
  //   console.log('bax');
  //   this.getDashData();
  //   console.log('lkhjlk');
  // }

  /*componentWillMount() {
    this.getDashData();
  }
*/
  async componentDidMount() {
    await this.getDashData();
    const { lng, lat, fieldies } = this.state;

    //console.log('slappydashy', fieldies);

    //let thisMap = this.map;

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



    let wholeObj = {
      type: 'geojson',
      data: {
      type: "FeatureCollection",
        features: fields
      }
    };

    console.log('obj', JSON.stringify(wholeObj));

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

      thisMap.on('click', 'fieldsBoundaries', function (e) {
        console.log('clicked', e);
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.name)
          .addTo(thisMap);
      });



    });


    /*for (let field in fields) {
      this.map.addLayer({
        'id': field.name,
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': field.boundary.type.toString(),
              'coordinates': field.boundary.coordinates[0]
            }
          }
        }

      })
    }*/

    /*this.map.on('load', () => {
      this.map.addSource('fields', {
        type: 'geojson',


      })
    })*/

  }


  render() {
    return (
      <div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    )
  }

}

export default HBMap;
