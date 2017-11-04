/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  NavigatorIOS,
  TouchableOpacity,
  Linking,
  Alert,
  AsyncStorage
} from 'react-native';
import {SERVER_IP, SERVER_PORT} from '../config/config.js'
import {
  Actions
} from 'react-native-router-flux';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class QrCode extends Component<{}> {
  constructor() {
    super();

    this.joinGroup = this.joinGroup.bind(this)
  }
  onSuccess(e) {
    const that = this;
    fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/events/${e.data}`, {method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }})
    .then(
      response => response.json(),
      error => console.log('An error occured.', error)
    )
    .then(json => {
      if (json.event) {
        console.log(json);
        Alert.alert(
          json.event.name,
          'Do you want to join this event?',
          [
            {text: 'Join', onPress: () => {that.joinGroup(json.event._id)}},
            {text: 'No', onPress: () => {that.refs.scanner.reactivate()}, style: 'cancel'}
          ],
          { cancelable: false }
        )
      }
    })
  }

  joinGroup(eventId) {
    console.log(eventId);
    try {
      const value = AsyncStorage.getItem('@shogunStore:user', (err, result) => {
        console.log(result);
        if (result) {
          const user = JSON.parse(result);
          fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/events/${eventId}`, {method: 'patch',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: user._id})})
          .then(
            response => response.json(),
            error => console.log('An error occured.', error)
          )
          .then(json => {
            if (json.error) {
              Alert.alert(
                "Error",
                'You already joined this event',
                [
                  {text: 'Ok', onPress: () => {this.refs.scanner.reactivate()}, style: 'cancel'}
                ],
                { cancelable: false }
              )
            } else {
              Actions.pop({refresh: {key: "events"}});
            }
            console.log(json);
          })
        }
      });
    } catch (error) {
      // Error retrieving data
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <QRCodeScanner
          style={{flex: 1}}
          ref={"scanner"}
          onRead={this.onSuccess.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    padding: 16,
  },
});

AppRegistry.registerComponent('QrCode', () => QrCode);
