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
  AsyncStorage,
  RefreshControl
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class Events extends Component<{}> {
  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      ds: ds,
      fromReload: false,
      refreshing: false
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

  componenentWillUpdate() {
  }

  _onPressButton() {

    }

    componentDidUpdate() {
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
              console.log(this.state.dataSource);
              if (this.state.fromReload === true) {
                this.state.fromReload = false
              } else {
                this.state.dataSource = this.state.ds.cloneWithRows(json.events);
                this.state.fromReload = true;
                this.forceUpdate();
              }
            })
          }
      });
      } catch (error) {
        console.log(error);
      }
    }

    _onRefresh() {
       this.setState({refreshing: true});

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
               console.log(this.state.dataSource);
               this.setState({refreshing: false});
               this.state.dataSource = this.state.ds.cloneWithRows(json.events);
               this.state.fromReload = true;
               this.forceUpdate();
             })
           }
       });
       } catch (error) {
         console.log(error);
       }
     }

  render() {
    console.log('here');
    return (
      <View style={{flex: 1}}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {return (
            <TouchableOpacity  style= {styles.container} onPress={() => Actions.event({eventObj: rowData, title: rowData.name})}>
              <View style={{height: 30}}>
                <Text style= {styles.text}>{rowData.name}</Text>
              </View>
            </TouchableOpacity>
          )}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
      padding: 10,
      backgroundColor: 'white',
      marginTop: 3,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
   },
   text: {
      color: '#fff'
   }
});
AppRegistry.registerComponent('Events', () => Events);
