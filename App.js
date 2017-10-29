//import React from 'react';

import React, { Component } from 'react';
import { StyleSheet, Text, View, AppRegistry,
Image, } from 'react-native';

/*export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/


//const remote = {require('fond')};

export default class BackgroundImage extends Component {
  render() {

    return (
         <View>
      <Image
        style={{
          flex: 1,
          backgroundColor: 'red',
          width: 66, height: 58
        //  resizeMode="cover",
        }}
         source={require('./bg1b.png')}
      />
         </View>
    );
  }
}

AppRegistry.registerComponent('BackgroundImage', () => BackgroundImage);
