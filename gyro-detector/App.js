import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

export default class AccelerometerSensor extends React.Component {
  state = {
    accelerometerData: {},
    recentCalls: 0
  }
  componentDidMount() {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
  }
  componentWillUnmount() {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }
  render() {
    var directions = {
      x: 0,
      z: 0
    }
    var position = this.state.accelerometerData;
    if ( this.state.recentCalls == 6 ) {
      if ( (position.x < 0.2 && position.x > -0.2) || (position.z < 0.2 && position.z > -0.2) ) this.state.recentCalls = 0;
      return null
    }
    if ( this.state.recentCalls <= 5 && this.state.recentCalls > 0 ) this.state.recentCalls--;
    if ( this.state.recentCalls > 0 ) return null;
    if ( position.x >= 1 || position.x <= -1 ) {
      directions.x = Math.sign(position.x);
      this.state.recentCalls = 6;
    }
    if ( position.z >= 1 || position.z <= -1 ) {
      directions.z = Math.sign(position.z);
      this.state.recentCalls = 6;
    }
    console.log(directions);
    return null;
  }
}
