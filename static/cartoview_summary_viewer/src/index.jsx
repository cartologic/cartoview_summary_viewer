import React from 'react';
import {render, findDOMNode} from 'react-dom';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import ol from 'openlayers'
import WpsClient from './wps-client.jsx';
import $ from "jquery";
import 'openlayers/css/ol.css';
import './app.css';
import FloatingPanel from './floatingPanel';
import {
  Container,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Card,
  CardTitle,
  CardText,
  CardBlock,
  Badge
} from 'reactstrap';
export default class CartoviewCharts extends React.Component {
  constructor(props) {
    super(props)
    this.map = new ol.Map({
      //controls: [new ol.control.Attribution({collapsible: false}), new ol.control.ScaleLine()],
      layers: [new ol.layer.Tile({title: 'OpenStreetMap', source: new ol.source.OSM()})],
      view: new ol.View({
        center: [
          0, 0
        ],
        zoom: 3,
        minZoom: 3,
        maxZoom: 19
      })
    });

    this.wpsClient = new WpsClient({geoserverUrl: geoserver_url});
    this.state = {
      data: [],
      loading: true,
      config: {
        mapId: map_id
      }
    }
    this.map.once('postrender', function(event) {
      var extent = this.map.getView().calculateExtent(this.map.getSize());
      let filters = {
        minx: extent[0],
        miny: extent[1],
        maxx: extent[2],
        maxy: extent[3]
      }
      this.updateResults(filters);
    });

    this.map.on('moveend', () => {
      var extent = this.map.getView().calculateExtent(this.map.getSize());
      let filters = {
        minx: extent[0],
        miny: extent[1],
        maxx: extent[2],
        maxy: extent[3]
      }
      this.updateResults(filters);
    });

  }
  update(config) {
    if (config && config.mapId) {
      var url = mapUrl;
      fetch(url, {
        method: "GET",
        credentials: 'include'
      }).then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      }).then((config) => {
        if (config) {
          MapConfigService.load(MapConfigTransformService.transform(config), this.map);
        }
      });

    }
  }
  componentWillMount() {
    this.update(this.state.config);
  }
  updateResults(extent) {
    let data = [],
      loading = true;
    this.setState({data, loading});
    appConfig.summaryViewer.items.forEach((item, i) => {
      if(extent != undefined){
        this.wpsClient.aggregateWithFilters({aggregationAttribute: item.attribute, aggregationFunction: item.operation, filters: extent, typeName: item.layer}).then((res) => {
          data.push({value: res.AggregationResults[0][0], title: item.title});
          if (data.length == appConfig.summaryViewer.items.length) {
            loading = false;
          }
          this.setState({data, loading})
          $(".se-pre-con").fadeOut("slow");


        });
      }else{
        this.wpsClient.aggregate({aggregationAttribute: item.attribute, aggregationFunction: item.operation, typeName: item.layer}).then((res) => {
          data.push({value: res.AggregationResults[0][0], title: item.title});
          if (data.length == appConfig.summaryViewer.items.length) {
            loading = false;
          }
          this.setState({data, loading})
          $(".se-pre-con").fadeOut("slow");


        });
      }

    });

  }
  componentDidMount() {
    this.map.setTarget(findDOMNode(this.refs.map));

  }
  render() {

    return (
      <div className="full-height-width">
        <div ref="map" className="map"></div>
        <FloatingPanel data={this.state.data} loading={this.state.loading}></FloatingPanel>
      </div>

    )
  }
}
render(
  <CartoviewCharts></CartoviewCharts>, document.getElementById('root'))
