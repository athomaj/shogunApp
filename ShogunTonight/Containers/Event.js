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
  Image,Dimensions
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
const width = Dimensions.get('window').width

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
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(props.eventObj.images),
      ds: ds
    }
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

            firebase.storage().ref('eventImages/' + response.fileName).putFile(response.uri, {
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
          }
        });
      }

      renderRow (image) {
        return <View style={styles.card}>
           <Image source={image.url}/>
         </View>
       }

  render() {
    var dateFormat = require('dateformat');
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;
    var dispStartDate = dateFormat(startDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    var dispEndDate = dateFormat(endDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return (
      <View style={{marginTop: 50, justifyContent: 'center', alignItems: 'center'}}>

      <Text>{this.state.description}</Text>
      <Text>{dispStartDate}</Text>
      <Text>{dispEndDate}</Text>
      <ListView
        contentContainerStyle={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
     </View>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: 'red',
    width: (width / 2) - 15,
    height: 300,
    marginLeft: 10,
    marginTop: 10
  }
});

AppRegistry.registerComponent('Event', () => Event);
