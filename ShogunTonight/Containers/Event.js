/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TouchableOpacity,
  Image
} from 'react-native';

import { moment } from 'moment';
import firebase from 'react-native-firebase';

var ImagePicker = require('react-native-image-picker');

// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

var globalthis;

export default class Event extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      startDate: props.eventObj.startDate,
      endDate: props.eventObj.endDate,
      description: props.eventObj.description,
    }
    globalthis = this;
    this.onImageClicked = this.onImageClicked.bind(this)
  }

  static renderRightButton = (props) => {
console.log(props);
            return (

                <TouchableOpacity onPress={() => globalthis.onImageClicked()}>
                <Image style={{margin : 10}}
                 source={require('../img/5224.png')}
               />
                </TouchableOpacity>
            );
      }

      onImageClicked() {
        ImagePicker.showImagePicker(null, (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {
            let source = { uri: response.uri };


          }
        });
      }

  render() {
    var dateFormat = require('dateformat');
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;
    var dispStartDate = dateFormat(startDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    var dispEndDate = dateFormat(endDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return (
      <View style={{marginTop: 50, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Information :</Text>
      <Text>{this.state.description}</Text>
      <Text>{dispStartDate}</Text>
      <Text>{dispEndDate}</Text>
     </View>
    );
  }
}
AppRegistry.registerComponent('Event', () => Event);
