import React, {Component} from 'react';
import RowItem from './SummaryViewerItem'

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
    value: 'Media'
  }
]

export default class SummaryViewerConfig extends Component {

  constructor(props) {
    super(props)
    this.state = {
      items: this.props.items,
      layers: [],
      attributes: [],
      success: this.props.success
    }
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

  save(e) {
    let config = {
      summaryViewer: {
        items: this.state.items
      }
    }
    this.props.onComplete(config)
  }

  componentWillMount() {
    this.loadLayers()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({success: nextProps.success})
  }

  onAddClick() {
    let items = this.state.items;
    items.push({title: "", layer: "", attribute: "", operation: ""})
    this.setState({items: items})

  }

  onRemoveClick(index) {
    let items = this.state.items
    items.splice(index, 1)
    this.setState({items: items})
  }

  updateValues(itemObject, index) {
    let items = this.state.items
    items[index] = itemObject;
    this.setState({items: items, success: false})
  }

  renderNextPrevious() {
    return (
      <div className="row">
        <div className="col-xs-5 col-md-4"></div>
        <div className="col-xs-7 col-md-8">
          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className="btn btn-primary btn-sm pull-right" onClick={this.save.bind(this)}>{"next >>"}</button>

          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className="btn btn-primary btn-sm pull-right" onClick={() => this.props.onPrevious()}>{"<< Previous"}</button>
        </div>
      </div>
    )
  }

  renderHeader() {
    return (
      <div className="row" style={{
        marginTop: "3%"
      }}>
        <div className="col-xs-5 col-md-4">
          <h4>{'Summary Viewer Configuration '}</h4>
        </div>
        <div className="col-xs-7 col-md-8">
          <a style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className={this.state.success === true
            ? "btn btn-primary btn-sm pull-right"
            : "btn btn-primary btn-sm pull-right disabled"} href={`/apps/cartoview_summary_viewer/${this.props.id}/view/`}>
            View
          </a>

          <a style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className={this.state.success === true
            ? "btn btn-primary btn-sm pull-right"
            : "btn btn-primary btn-sm pull-right disabled"} href={`/apps/appinstance/${this.props.id}/`} target={"_blank"}>
            Details
          </a>

          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className={this.state.success === true
            ? "btn btn-primary btn-sm pull-right disabled"
            : "btn btn-primary btn-sm pull-right"} onClick={this.save.bind(this)}>Save</button>

          <p style={this.state.success == true
            ? {
              display: "inline-block",
              margin: "0px 3px 0px 3px",
              float: "right"
            }
            : {
              display: "none",
              margin: "0px 3px 0px 3px",
              float: "right"
            }}>App instance successfully created!</p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="row">

        {this.renderNextPrevious()}

        {this.renderHeader()}

        <hr></hr>

        {this.state.items.map((item, index) => {
          return <RowItem key={`${index}`} index={index} onRemoveClick={(index) => {
            this.onRemoveClick(index)
          }} updateValues={(itemObject, index) => {
            this.updateValues(itemObject, index)
          }} {...this.props} item={item}/>
        })}

        <div className="row">
          <div className="col-xs-5 col-md-4">
            <button className={'btn btn-primary'} onClick={() => {
              this.onAddClick()
            }}>Add Item</button>
          </div>
        </div>
      </div>
    )
  }
}
