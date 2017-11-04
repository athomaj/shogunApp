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
  ListView,
  TouchableOpacity
} from 'react-native';


export default class Events extends Component<{}> {
  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      ds: ds
    }

    fetch(`http://localhost:3000/api/events?userId=${'59fd9a2c76194a1447a9bdcd'}`, {method: 'get',
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

  componentWillMount() {

  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {return (
            <TouchableOpacity onPress={() => console.log(rowData)}>
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
