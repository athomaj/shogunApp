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
  Actions,
  TouchableOpacity
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

export default class Profile extends Component<{}> {
  _onPressButton() {
   Actions.events();

 }
  render() {
    return (
      <View>
        <View style={{marginTop: 150, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={this._onPressButton}>
                       <Text>Photo</Text>
         </TouchableOpacity>
        </View>
     </View>
    );
  }
}
AppRegistry.registerComponent('Profile', () => Profile);
