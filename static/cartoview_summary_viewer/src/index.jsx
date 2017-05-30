import React from 'react';
import {render, findDOMNode} from 'react-dom';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import ol from 'openlayers'
import WpsClient from './wps-client.jsx';
import $ from "jquery";
import 'openlayers/css/ol.css';
import './app.css';
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
      panelOpen: true,
      loading: true,
      config: {
        mapId: map_id
      }
    }
    this.map.once('postrender', function(event) {
      console.log(event)
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
  _togglePanel() {
    this.setState({
      panelOpen: !this.state.panelOpen
    })
  }
  render() {
    let Style = this.state.panelOpen
      ? {
        display: 'block'
      }
      : {
        display: 'none'
      };
    let element = this.state.panelOpen
      ? <i className="fa fa-chevron-down"></i>
      : <i className="fa fa-chevron-up"></i>;
    let cards = this.state.data.map((item, i) => {
      let card = <Card key={i} style={{
        marginRight: 10
      }}>
        <CardBlock>
          <CardTitle>{item.title}</CardTitle>
          <hr></hr>
          <CardText style={{
            textAlign: 'center'
          }}>
            <Badge color="success" pill>{item.value}</Badge>
          </CardText>
        </CardBlock>
      </Card>;
      return card
    })
    return (
      <div style={{
        height: '100%',
        width: '100%'
      }}>
        <div ref="map" className="map"></div>
        <div style={{
          width: '100%',
          position: 'absolute',
          bottom: 0
        }}>
          <Row>
            <Col style={{
              textAlign: 'center'
            }} sm={{
              size: 6,
              push: 2,
              pull: 2,
              offset: 1
            }}>
              <Button onClick={this._togglePanel.bind(this)} color="secondary">{element}</Button>
            </Col>
          </Row>
          <Row style={Style}>
            <Col style={{
              background: 'white',
              borderRadius: 5,
              border: 'solid lightgray 1px'
            }} sm={{
              size: 6,
              push: 2,
              pull: 2,
              offset: 1
            }}>
              <Row id="style-7" style={{
                overflowX: 'auto'
              }}>
                {cards}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
render(
  <CartoviewCharts></CartoviewCharts>, document.getElementById('root'))
