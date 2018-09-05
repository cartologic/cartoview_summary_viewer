import '../css/app.css'

import React, {Component} from 'react'

import EditService from './services/editService.jsx'
import General from './components/General.jsx'
import NavigationTools from './components/NavigationTools.jsx'
import Navigator from './components/Navigator.jsx'
import ResourceSelector from './components/ResourceSelector.jsx'
import SummaryViewerConfig from './components/SummaryViewerConfig.jsx'

// import MapTools from './components/MapTools.jsx'
// import Reporting from './components/Reporting.jsx'
// import DisplayConfig from './components/DisplayConfig.jsx'


// summaryViewer items for next use:
// this.props.config.instance.config.summaryViewer.items

export default class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      config: {},
      selectedResource: this.props.config.instance
        ? this.props.config.instance.map
        : undefined
    }
    this.editService = new EditService({baseUrl: '/'})
  }

  goToStep(step) {
    this.setState({step});
  }

  onPrevious() {
    let {step} = this.state;
    this.goToStep(step -= 1)
  }

  render() {
    var {step} = this.state;
    const steps = [
      {
        label: "Select Map",
        component: ResourceSelector,
        props: {
          resourcesUrl: this.props.config.urls.resources_url,
          instance: this.state.selectedResource,
          username: this.props.username,
          selectMap: (resource) => {
            this.setState({selectedResource: resource})
          },
          limit: this.props.config.limit,
          onComplete: () => {
            var {step} = this.state;
            this.setState({
              config: Object.assign(this.state.config, {map: this.state.selectedResource.id})
            })
            this.goToStep(++step)
          }
        }
      }, {
        label: "General ",
        component: General,
        props: {
          state: this.state,
          keywords: this.props.keywords,
          urls: this.props.config.urls,
          instance: this.state.selectedResource,
          config: this.props.config.instance
            ? this.props.config.instance.config
            : undefined,
          onComplete: (basicConfig) => {
            let {step} = this.state;
            this.setState({
              config: Object.assign(this.state.config, basicConfig)
            })
            this.goToStep(++step)
          },
          onPrevious: () => {
            this.onPrevious()
          }
        }
      }, {
        label: "Navigation Tools",
        component: NavigationTools,
        props: {
          instance: this.state.selectedResource,
          config: this.props.config.instance
            ? this.props.config.instance.config
            : this.state.config.config
              ? this.state.config.config
              : undefined,
          onComplete: (basicConfig) => {
            var {step} = this.state;
            this.setState({
              config: Object.assign(this.state.config, basicConfig)
            })
            this.goToStep(++step)
          },
          onPrevious: () => {
            this.onPrevious()
          }
        }
      }, {
        label: "Summary Viewer Configuration",
        component: SummaryViewerConfig,
        success: this.state.success,
        props: {
          items: this.props.config.instance
            ? this.props.config.instance.config.summaryViewer.items
            : [],
          instance: this.state.selectedResource,
          config: this.props.config.instance
            ? this.props.config.instance.config
            : this.state.config.config
              ? this.state.config.config
              : undefined,
          id: this.state.id,
          urls: this.props.config.urls,
          success: this.state.success,
          onComplete: (basicConfig) => {
            // console.log("state.:", this.state);
            var {step, config} = this.state;
            Object.assign(config.config, basicConfig);
            config.widgets = {
              SummaryViewer: true
            }
            this.setState({
              config: config
            }, () => {
              console.log(this.state);
            })

            this.editService.save(this.state.config, this.props.config.instance
              ? this.props.config.instance.id
              : this.state.id || undefined).then((res) => {
              if (res.success == true)
                this.setState({success: true, id: res.id})
            })

          },
          onPrevious: () => {
            this.setState({
              success: false
            }, () => {
              this.onPrevious()
            })

          }
        }
      }

    ]
    return (
      <div className="wrapping">
        <Navigator steps={steps} step={step} onStepSelected={(step) => this.goToStep(step)}/>
        <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel">
          {steps.map((s, index) => index == step && <s.component key={index} {...s.props}/>)}
        </div>
      </div>
    )
  }
}
