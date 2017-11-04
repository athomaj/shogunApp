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
  Image,
  TextInput
} from 'react-native';

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


export default class Profile extends Component<{}> {
  _onPressButton() {
   Actions.events();

  }

  constructor() {
    super();
    this.state = {
      profileImg: require('../img/new-user-image-default.png')
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

        firebase.storage().ref('profileImages/' + response.fileName).putFile(response.uri, {
              contentType: 'image/jpeg',
            }).on('state_changed',
                (progress) => {
                  console.log(progress);
                },
                (error) => {
                  console.debug(error);
                },
                (uploadedFile) => {
                    console.debug(uploadedFile);
                    
                });

        this.setState({
          profileImg: source
        });
      }
    });
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <View style={{marginTop: 60, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={this.onImageClicked.bind(this)}>
          {this.state.profileImg != null &&
            <Image style={{borderRadius:75, width: 150, height: 150}} source={this.state.profileImg} />
          }
         </TouchableOpacity>
         <TextInput style = {styles.input}
                        autoCapitalize="none"
                       // onSubmitEditing={() => this.passwordInput.focus()}
                        autoCorrect={false}
                        returnKeyType="next"
                        placeholder='Choose a username'
                        placeholderTextColor='rgba(225,225,225,0.7)'/>
        <TouchableOpacity style={styles.buttonContainer}
                       onPress={this._onPressButton}>
                       <Text  style={styles.buttonText}>Save</Text>
         </TouchableOpacity>
        </View>
     </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
     padding: 20
    },
    input:{
        height: 40,
      backgroundColor: 'white',
        marginBottom: 10,
        padding: 10,
        marginTop:25,
        backgroundColor: 'rgba(225,225,225,0.2)',
        color: '#fff'
    },
    buttonContainer:{
       backgroundColor: '#2980b6',
       paddingVertical: 10,
       marginBottom: 10,
       padding: 70,
       marginTop: 20
   },
   buttonText:{
       color: '#fff',
       textAlign: 'center',
       fontWeight: '700'
   }
  });
AppRegistry.registerComponent('Profile', () => Profile);
