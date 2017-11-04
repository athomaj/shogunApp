/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {SERVER_IP, SERVER_PORT} from '../config/config.js'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  ListView,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class Events extends Component<{}> {
  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      ds: ds
    }

    try {
      const value = AsyncStorage.getItem('@shogunStore:user', (err, result) => {
        if (result) {
          const user = JSON.parse(result);
          fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/events?userId=${user._id}`, {method: 'get',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }})
          .then(
            response => response.json(),
            error => console.log('An error occured.', error)
          )
          .then(json => {
            this.state.dataSource = ds.cloneWithRows(json.events);
            this.forceUpdate();
            console.log(json.events);
          })
        }
    });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillMount() {

  }

  _onPressButton() {

    }

    componentDidUpdate() {
    }

  render() {
    console.log('here');
    return (
      <View style={{flex: 1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {return (
            <TouchableOpacity onPress={() => Actions.event({eventObj: rowData, title: rowData.name})}>
              <View style={{backgroundColor: 'blue', height: 30}}>
                <Text>{rowData.name}</Text>
              </View>
            </TouchableOpacity>
          )}}
        />
      </View>
    );
  }
}
AppRegistry.registerComponent('Events', () => Events);
