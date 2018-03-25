import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

export default class AccelerometerSensor extends React.Component {
  state = {
    accelerometerData: {},
    recentCalls: 0,
    aValue: 0
  }
  componentDidMount() {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({accelerometerData});
    });
  }
  componentWillUnmount() {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }
  _pressA(value) {
    this.state.aValue = value;
  }
  _intentionalCrash() {
    throw new Error("Disconnected from server.");
  }
  render() {
    var _staticData = (
      <View>
        <TouchableOpacity style={{
          backgroundColor: "#0099ff",
          paddingTop: "70%",
          paddingBottom: "70%"
        }} activeOpacity = {.5} onPress={() => this._pressA(1)}>
          <Text style={{
            textAlign: "center",
            fontSize: 50
          }}>A</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: "#00ff99",
          paddingTop: "20%",
          paddingBottom: "20%"
        }} activeOpacity = {.5} onPress={() => this._pressA(-1)}>
          <Text style={{
            textAlign: "center",
            fontSize: 25
          }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: "#ff9900",
          paddingTop: "5%",
          paddingBottom: "10%"
        }} activeOpacity = {.5} onPress={() => {throw new Error("Now disconnected from server.")}}>
          <Text style={{
            textAlign: "center",
            fontSize: 15
          }}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    );
    var directions = {
      x: 0,
      z: 0,
      a: this.state.aValue
    }
    this.state.aValue = 0;
    var position = this.state.accelerometerData;
    if ( this.state.recentCalls == 6 ) {
      if ( (position.x < 0.2 && position.x > -0.2) || (position.z < 0.2 && position.z > -0.2) ) this.state.recentCalls = 0;
      return _staticData;
    }
    if ( this.state.recentCalls <= 5 && this.state.recentCalls > 0 ) this.state.recentCalls--;
    if ( this.state.recentCalls > 0 ) return _staticData;
    if ( position.x >= 1 || position.x <= -1 ) {
      directions.x = Math.sign(position.x);
      this.state.recentCalls = 6;
    }
    if ( position.z >= 1 || position.z <= -1 ) {
      directions.z = Math.sign(position.z);
      this.state.recentCalls = 6;
    }
    console.log(directions);
    return _staticData;
  }
}
