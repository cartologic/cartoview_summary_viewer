import React from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  CardTitle,
  CardText,
  CardBlock,
  Badge
} from 'reactstrap';

export default class FloatingPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      panelOpen: true
    }
  }
  _togglePanel() {
    this.setState({
      panelOpen: !this.state.panelOpen
    })
  }
  render() {
    let expandingIcon = this.state.panelOpen
      ? <i className="fa fa-chevron-down"></i>
      : <i className="fa fa-chevron-up"></i>;
    let Style = this.state.panelOpen
      ? {
        display: 'block'
      }
      : {
        display: 'none'
      };
    let loadingItems = <Card style={{
      marginRight: 10
    }}>
      <CardBlock>
        <CardTitle>Processing</CardTitle>
        <hr></hr>
        <CardText style={{
          textAlign: 'center'
        }}>
          <i className="fa fa-circle-o-notch fa-spin" style={{fontSize:48}}></i>
        </CardText>
      </CardBlock>
    </Card>;

    let cards = this.props.data.map((item, i) => {
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
    let items = this.props.loading ? loadingItems : cards ;
    return (
      <div className="panel-wrapper">
        <Row>
          <Col style={{
            textAlign: 'center'
          }} sm={{
            size: 6,
            push: 2,
            pull: 2,
            offset: 1
          }}>
            <Button onClick={this._togglePanel.bind(this)} color="secondary">{expandingIcon}</Button>
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
            <Row id="style-7" className="scrollbar-x">
              {items}
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
