import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

export default class MainApp extends React.Component {
  state = {
    mode: 0,
    address: null,
    code: null
  }
  render() {
    var t = this;
    if ( this.state.mode == 0 ) {
      return (
        <LoginPage onConnect={(address,code) => {
          this.setState({
            mode: 1,
            address,
            code
          });
        }} />
      )
    } else {
      console.log(this.state);
      return (
        <DetectorPage address={this.state.address} code={this.state.code} onDisconnect={_ => {
          this.setState({
            mode: 0
          });
        }} />
      );
    }
    return null;
  }
}

class LoginPage extends React.Component {
  state = {
    address: ""
  }
  _connect() {
    console.log("here");
    var t = this;
    var req = new XMLHttpRequest();
    req.onload = function() {
      if ( this.responseText == "err_not_available" ) {
        Alert.alert("This machine cannot accept more controllers.","Please disconnect a different controller in order to connect.",[{
          text: "OK",
          onPress: Function.prototype
        }]);
      } else {
        t.props.onConnect(t.state.address,this.responseText);
      }
    }
    if ( ! this.state.address.startsWith("http://") ) this.state.address = "http://" + this.state.address;
    req.open("GET",`${this.state.address}/internal/connect`);
    req.send();
  }
  render() {
    return (
      <View>
        <Text>{"\n\n"}</Text>
        <TextInput
          style={{
            height: 50,
            fontSize: 20,
            borderColor: "gray",
            borderWidth: 1
          }}
          autoCorrect={false}
          placeholder={"Machine Address"}
          onChangeText={text => this.setState({
            address: text
          })}
        />
        <TouchableOpacity style={{
          backgroundColor: "#0088ff",
          height: 40
        }} activeOpacity = {.5} onPress={_ => this._connect.apply(this)}>
          <Text style={{
            textAlign: "center",
            fontSize: 30
          }}>Connect</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class DetectorPage extends React.Component {
  state = {
    accelerometerData: {},
    recentCalls: 0,
    recentCallItem: 0,
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
  _sendInfo(data) {
    var t = this;
    var req = new XMLHttpRequest();
    req.onload = function() {
      if ( this.responseText != "ok" ) {
        Alert.alert("You were disconnected","The machine was manually disconnected this controller.",[{
          text: "OK",
          onPress: t.props.onDisconnect
        }]);
      }
    }
    data.code = this.props.code;
    req.open("GET",`${this.props.address}/internal/move?${JSON.stringify(data)}`);
    req.send();
  }
  _disconnect() {
    var t = this;
    var req = new XMLHttpRequest();
    req.onload = function() {
      t.props.onDisconnect();
    }
    req.open("GET",`${this.props.address}/internal/disconnect?${this.props.code}`);
    req.send();
  }
  render() {
    var _staticData = (
      <View>
        <TouchableOpacity style={{
          backgroundColor: "#0099ff",
          paddingTop: "70%",
          paddingBottom: "70%"
        }} activeOpacity = {.5} onPress={_ => this._pressA(1)}>
          <Text style={{
            textAlign: "center",
            fontSize: 50
          }}>A</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: "#00ff99",
          paddingTop: "20%",
          paddingBottom: "20%"
        }} activeOpacity = {.5} onPress={_ => this._pressA(-1)}>
          <Text style={{
            textAlign: "center",
            fontSize: 25
          }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: "#ff9900",
          paddingTop: "5%",
          paddingBottom: "10%"
        }} activeOpacity = {.5} onPress={_ => this._disconnect.apply(this)}>
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
      if ( (position.x < 0.2 && position.x > -0.2) && this.state.recentCallItem == 1 || (position.z < 0.2 && position.z > -0.2) && this.state.recentCallItem == 2 ) {
        this.state.recentCalls = 5;
        this.state.recentCallItem = 0;
      }
      return _staticData;
    }
    if ( this.state.recentCalls <= 5 && this.state.recentCalls > 0 ) this.state.recentCalls--;
    if ( this.state.recentCalls > 0 ) return _staticData;
    if ( position.x >= 1 || position.x <= -1 ) {
      directions.x = Math.sign(position.x);
      this.state.recentCalls = 6;
      this.state.recentCallItem = 1;
    }
    if ( position.z >= 1 || position.z <= -1 ) {
      directions.z = Math.sign(position.z);
      this.state.recentCalls = 6;
      this.state.recentCallItem = 2;
    }
    if ( directions.x != 0 || directions.z != 0 || directions.a != 0 ) this._sendInfo(directions);
    return _staticData;
  }
}
