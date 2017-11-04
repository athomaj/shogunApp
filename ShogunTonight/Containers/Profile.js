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
  Image,
  TextInput,
  AsyncStorage,
  Alert,
  Dimensions
} from 'react-native';

const uuidv1 = require('uuid/v1');

import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import {SERVER_IP, SERVER_PORT} from '../config/config.js'
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

const width = Dimensions.get('window').width

export default class Profile extends Component<{}> {

  constructor() {
    super();
    this.state = {
      profileImg: '',
      profileImgUri: require('../img/new_user_image_default.png'),
      profileImgToUpdate: false,
      newUserName: '',
      username: '',
      saving: false
    };

    try {
      const value = AsyncStorage.getItem('@shogunStore:user', (err, result) => {
        console.log(result);
        if (result) {
          const user = JSON.parse(result);
          console.log(user);
          if (user.profileImage && user.profileImage.url) {
            this.state.profileImgUri = {uri: user.profileImage.url};
            console.log('HERE');
          }
          this.setState({username: user.username});
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  _onPressButton() {
     try {
       const value = AsyncStorage.getItem('@shogunStore:user', (err, result) => {
         console.log(result);
         if (result) {
           this.setState({saving: true});
           const user = JSON.parse(result);
           const body = {};

           if (this.state.newUserName) {
             body.username = this.state.newUserName;
           }
           if (this.state.profileImgToUpdate == true) {
             firebase.storage().ref('profileImages/' + uuidv1()).putFile(this.state.profileImg.uri, {
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
                       body.profileImg = uploadedFile.downloadURL;
                       this.updateUser(user, body);
                   });
           } else {
             this.updateUser(user, body)
           }
         }
       });
     } catch (error) {
       // Error retrieving data
     }
  }

  updateUser(user, body) {
    fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/users/${user._id}`, {method: 'patch',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)})
    .then(
      response => response.json(),
      error => console.log('An error occured.', error)
    )
    .then(json => {
      this.setState({saving: false});
      try {
        AsyncStorage.setItem('@shogunStore:user', JSON.stringify(json.user));
        // Alert.alert(
        //   "Profile",
        //   'Your Profile has been updated',
        //   [
        //     {text: 'Ok', onPress: () => {Actions.pop()}, style: 'cancel'}
        //   ],
        //   { cancelable: false }
        // )
      } catch (error) {
        console.error(error);
      }
    })

  }

  onImageClicked() {
    ImagePicker.showImagePicker({maxWidth: 300, maxHeight: 600}, (response) => {
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
          profileImg: response,
          profileImgUri: source,
          profileImgToUpdate: true
        });
      }
    });
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <Spinner visible={this.state.saving} textContent={"Saving..."} textStyle={{color: '#FFF'}} />
        <View style={{marginTop: 60, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={this.onImageClicked.bind(this)}>
          {this.state.profileImgUri != null &&
            <Image style={{borderRadius:75, width: 150, height: 150}} source={this.state.profileImgUri} />
          }
         </TouchableOpacity>
         <TextInput style = {styles.input}
                        autoCapitalize="none"
                       // onSubmitEditing={() => this.passwordInput.focus()}
                        autoCorrect={false}
                        returnKeyType="next"
                        placeholder={this.state.username}
                        onChangeText={(newUserName) => this.setState({newUserName})}
                        value={this.state.newUserName}
                        placeholderTextColor='rgba(225,225,225,0.7)'/>
        <TouchableOpacity style={styles.buttonContainer}
                       onPress={this._onPressButton.bind(this)}>
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
        width: width / 2,
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
