import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import CameraAlt from 'material-ui/svg-icons/image/camera-alt';
import _ from 'underscore';
import TestDevice from '../../examples/TestDevice.jsx';
import SmartLight from '../../examples/SmartLight.jsx';
import GrowHub from '../../examples/GrowHub.jsx';
import CreateComponent from './CreateComponent.jsx';

const components = {
  TestDevice,
  SmartLight,
  GrowHub,
};

const getComponentType = function(c) {
  return c.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }).capitalizeFirstLetter();
}

const availableComponents = [
  "test-device",
  "test-thing",
  "dr-dose",
  "weather-widget",
  "smart-light",
  "smart-pot",
  "fish-tank",
  "grow-hub"
];
_.each(availableComponents, (v) => {
  const cmp = getComponentType(v);
  if (!components[cmp]) {
    components[cmp] = TestDevice;
  }
});

export default class ThingDisplay extends Component {
  state = {
    dltOpen: false,
  };
  deleteThing = () => {
    const thing = this.props.thing;
    this.handleClose();
    Meteor.call('Thing.delete',
      thing.uuid,
      (error, document) => {
        if (error) {
          throw error;
        }
      }
    );
  };

  handleOpen = () => {
    this.setState({ dltOpen: true });
  };

  handleClose = () => {
    this.setState({ dltOpen: false });
  };

  render () {
    const thingStyle = {
      margin: '20px',
    }

    const actions = [
      <FlatButton
        label="No"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        onTouchTap={this.deleteThing}
      />,
    ];

    const r = this.props.thing.registeredAt;
    const unregisteredText = <div>
      <p>Connect a device using the following API crendentials or
        <br />
        create a test thing <span ref="loading"></span>
      </p>
      <p><b>UUID:</b></p> <p><span className="selectable">{this.props.thing.uuid}</span></p>
      <p><b>TOKEN:</b></p> <p><span className="selectable">{this.props.thing.token}</span></p>
    </div>;
    const cmpNameInCamel = getComponentType(this.props.thing.component || '');
    const RegisteredText = components[cmpNameInCamel];
    const cardText = r ? <RegisteredText thing={this.props.thing}/> : unregisteredText;
    return (
      <div>
        <Card style={thingStyle}>
          <CardTitle title={this.props.thing.name} />
          <CardText>
            {cardText}
          </CardText>
          <CardActions>
            { r ? null : <CreateComponent uuid={this.props.thing.uuid} token={this.props.thing.token} /> }
            <FlatButton label={r ? 'Delete': 'Cancel'} onTouchTap={this.handleOpen}/>
          </CardActions>
        </Card>
        <Dialog
          title="Are you sure?"
          actions={actions}
          modal={false}
          open={this.state.dltOpen}
          onRequestClose={this.handleClose}
        />
      </div>
    )
  }
}
