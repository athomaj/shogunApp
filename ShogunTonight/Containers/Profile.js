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
  TouchableOpacity,
  Image
} from 'react-native';

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


export default class Profile extends Component<{}> {
  _onPressButton() {
   Actions.events();

  }

  constructor() {
    super();
    this.state = {
      profileImg: null
    };
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

        this.setState({
          profileImg: source
        });
      }
    });
  }

  render() {
    return (
      <View>
        <View style={{marginTop: 150, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={this.onImageClicked.bind(this)}>
          <Text>Photo</Text>
          {this.state.profileImg != null &&
            <Image style={{width: 200, height: 200}} source={this.state.profileImg} />
          }
         </TouchableOpacity>
        </View>
     </View>
    );
  }
}
AppRegistry.registerComponent('Profile', () => Profile);
