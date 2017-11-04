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
  Image, Alert, Button, ImageBackground
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class SignUp extends Component<{}> {
  _onPressButton() {
   Actions.events();

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
                         placeholder='Choose a username'
                         placeholderTextColor='rgba(225,225,225,0.7)'/>
         <TouchableOpacity style={styles.buttonContainer}
                        onPress={this._onPressButton}>
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
