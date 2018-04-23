import React, {Component} from 'react';

const operations = [
  {
    key: 'Summation',
    value: 'Sum'
  }, {
    key: 'Average',
    value: 'Average'
  }, {
    key: 'Count',
    value: 'Count'
  }, {
    key: 'Maximum',
    value: 'Max'
  }, {
    key: 'Minimum',
    value: 'Min'
  }, {
    key: 'Median',
    value: 'Median'
  }
]

const numericTypes = [
  'xsd:byte',
  'xsd:decimal',
  'xsd:double',
  'xsd:int',
  'xsd:integer',
  'xsd:long',
  'xsd:negativeInteger',
  'xsd:nonNegativeInteger',
  'xsd:nonPositiveInteger',
  'xsd:positiveInteger',
  'xsd:short',
  'xsd:unsignedLong',
  'xsd:unsignedInt',
  'xsd:unsignedShort',
  'xsd:unsignedByte'
];

export default class Item extends Component {

  constructor(props) {
    super(props)
    this.state = {
      layers: [],
      attributes: [],

      title: this.props.item.title,
      layer: this.props.item.layer,
      attribute: this.props.item.attribute,
      operation: this.props.item.operation,

      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({title: nextProps.item.title, layer: nextProps.item.layer, attribute: nextProps.item.attribute, operation: nextProps.item.operation})
  }

  loadLayers() {
    fetch(`/apps/maplayers/api?id=${this.props.instance.id}`).then((response) => response.json()).then((data) => {
      this.setState({layers: data.objects})
    }).catch((error) => {
      console.error(error);
    });
  }

  loadAttributes(typename) {
    if (typename != "") {
      fetch(`/api/attributes/?layer__typename=${typename}`).then((response) => response.json()).then((data) => {
        this.setState({attributes: data.objects})
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  save() {
    this.props.updateValues({
      title: this.state.title,
      layer: this.state.layer,
      attribute: this.state.attribute,
      operation: this.state.operation
    }, this.props.index)
  }

  componentWillMount() {
    this.loadLayers()
    if (this.props.item.layer != '') {
      this.loadAttributes(this.props.item.layer)
    }
  }

  render() {
    return (
      <div className="row">
        <form>
          <div className="col-xs-12 col-md-3">
            <div className="form-group">
              <label>Item Title</label>
              <input value={this.state.title} onChange={(e) => {
                this.setState({
                  title: e.target.value
                }, () => {
                  this.save()
                })
              }} type="text" className="form-control" placeholder="Item title"/>
            </div>
          </div>

          <div className="col-xs-12 col-md-3">
            <div className="form-group">
              <label>Layer</label>
              <select className="form-control" onChange={(e) => {
                this.loadAttributes(e.target.value);
                this.setState({
                  layer: e.target.value
                }, () => {
                  this.save()
                })
              }} value={this.state.layer} required>
                <option value={""}>
                  Select Layer
                </option>
                {this.state.layers && this.state.layers.map((layer, i) => {
                  return <option key={`${i}`} value={layer.typename}>{layer.title}</option>
                })}
              </select>
            </div>
          </div>

          <div className="col-xs-12 col-md-3">
            <div className="form-group">
              <label>Attribute</label>
              <select className="form-control" onChange={(e) => {
                this.setState({
                  attribute: e.target.value
                }, () => {
                  this.save()
                })
              }} value={this.state.attribute} required>
                <option>
                  Select Attribute
                </option>
                {this.state.attributes && this.state.attributes.map((attribute, i) => {
                  // filter only numeric attributes
                  let type = attribute.attribute_type;
                  if (numericTypes.indexOf(type) != -1 && type.indexOf("gml:") == -1) {
                    return <option key={`${i}`} value={attribute.attribute}>{attribute.attribute}</option>
                  }
                })}
              </select>
            </div>
          </div>

          <div className="col-xs-12 col-md-2">
            <div className="form-group">
              <label>Operation</label>
              <select className="form-control" onChange={(e) => {
                this.setState({
                  operation: e.target.value
                }, () => {
                  this.save()
                })
              }} value={this.state.operation} required>
                <option>
                  Operation
                </option>
                {operations.map((operation, index) => {
                  return <option key={`${index}`} value={operation.value}>{operation.key}</option>
                })}
              </select>
            </div>
          </div>

          <div className="col-xs-12 col-md-1">
            <label></label>
            <button type="button" className={'btn btn-danger'} onClick={() => {
              this.props.onRemoveClick(this.props.index)
            }} style={{
              width: '100%'
            }}>X</button>
          </div>
        </form>
      </div>
    )
  }
}
