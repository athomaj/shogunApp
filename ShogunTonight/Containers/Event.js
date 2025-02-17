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
  Image,Dimensions,
  ListView
} from 'react-native';

const uuidv1 = require('uuid/v1');

import {SERVER_IP, SERVER_PORT} from '../config/config.js'
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

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      startDate: props.eventObj.startDate,
      endDate: props.eventObj.endDate,
      description: props.eventObj.description,
      dataSource: ds.cloneWithRows(props.eventObj.images),
      ds: ds
    }
    globalthis = this;
    this.onImageClicked = this.onImageClicked.bind(this)
  }

  static renderRightButton = (props) => {
            return (

                <TouchableOpacity onPress={() => globalthis.onImageClicked()}>
                <Image style={{margin : 10}}
                 source={require('../img/5224.png')}
               />
                </TouchableOpacity>
            );
      }

      onImageClicked() {
        const that = this;
        ImagePicker.showImagePicker({maxWidth: 300, maxHeight: 600}, (response) => {

          if (response.didCancel) {
          }
          else if (response.error) {
          }
          else if (response.customButton) {
          }
          else {
            let source = { uri: response.uri };

            firebase.storage().ref('eventImages/' + uuidv1()).putFile(response.uri, {
                contentType: 'image/jpeg',
              }).on('state_changed',
                  (progress) => {
                  },
                  (error) => {
                  },
                  (uploadedFile) => {
                      fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/events/${that.props.eventObj._id}`, {method: 'patch',
                        headers: {
                          'Accept': 'application/json, text/plain, */*',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({image: uploadedFile.downloadURL})})
                      .then(
                        response => response.json(),
                      )
                      .then(json => {
                        this.setState({
                          dataSource: this.state.ds.cloneWithRows(json.event.images)
                        });
                      })
                  });
          }
        });
      }

      renderRow (image) {
        return <View style={styles.card}>
           <Image style={{flex: 1}} source={{uri: image.url}}/>
         </View>
       }

  render() {
    var dateFormat = require('dateformat');
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;
    var description = this.state.description;
    var dispStartDate = dateFormat(startDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    var dispEndDate = dateFormat(endDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return (
      <View style={{marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{backgroundColor:'rgba(0,0,0,0.5)', borderRadius: 20, padding: 15, marginBottom: 20}}>
      <Text style={styles.text}>{description}</Text>
      <Text style={[styles.text, {marginTop: 10}]}>{dispStartDate}</Text>
      <Text style={styles.text}>{dispEndDate}</Text>
      </View>
      <ListView
        style={{marginBottom: 50}}
        contentContainerStyle={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
      <View style={{height: 50}} />
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
    width: (width / 2) - 15,
    height: 300,
    marginLeft: 10,
    marginTop: 10
  },
  text:{
    color: '#fff'
  }
});

AppRegistry.registerComponent('Event', () => Event);
