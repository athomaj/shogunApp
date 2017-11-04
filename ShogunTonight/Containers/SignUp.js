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
  TextInput,
  TouchableOpacity,
  Image, Alert, Button, ImageBackground, AsyncStorage,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {SERVER_IP, SERVER_PORT} from '../config/config.js'

const width = Dimensions.get('window').width

export default class SignUp extends Component<{}> {
  constructor() {
    super();

    this.state = {
      username: ''
    }
    try {
      const value = AsyncStorage.getItem('@shogunStore:user', (err, result) => {
        console.log(result);
        if (result) {
          const user = JSON.parse(result);
          Actions.events();
        }
      });
    } catch (error) {
      // Error retrieving data
    }
  }
  _onPressButton() {
    fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/users`, {method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: this.state.username})})
  .then(
    response => response.json(),
    error => console.log('An error occured.', error)
  )
  .then(json => {
    console.log(json);
    try {
      AsyncStorage.setItem('@shogunStore:user', JSON.stringify(json.user));
    } catch (error) {
      console.error(error);
    }
    Actions.events();
  })
 }
  render() {
    return (
      <View style={{flex:1}}>
      <ImageBackground style={{flex: 1}}
          resizeMode={'cover'} source={require('../img/fond123.png')}>
  <View style={{marginTop: 50, justifyContent: 'center', alignItems: 'center'}}>
          <Image
           source={require('../img/logo-2.png')}
         />
           </View>
        <View style={{marginTop: 150, justifyContent: 'center', alignItems: 'center'}}>

          <TextInput style = {styles.input}
                         autoCapitalize="none"
                        // onSubmitEditing={() => this.passwordInput.focus()}
                         autoCorrect={false}
                         returnKeyType="next"
                         onChangeText={(username) => this.setState({username})}
                         value={this.state.username}
                         placeholder='Choose a username'
                         placeholderTextColor='rgba(225,225,225,0.7)'/>
         <TouchableOpacity style={styles.buttonContainer}
                        onPress={this._onPressButton.bind(this)}>
                        <Text  style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
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
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        width: width / 2,
        padding: 10,
        color: '#fff'
    },
    buttonContainer:{
       backgroundColor: '#2980b6',
       paddingVertical: 15,
       marginBottom: 10,
       padding: 10,
       marginTop: 20
   },
   buttonText:{
       color: '#fff',
       textAlign: 'center',
       fontWeight: '700'
   }
  });

AppRegistry.registerComponent('SignUp', () => SignUp);
