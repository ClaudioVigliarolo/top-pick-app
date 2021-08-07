import React from 'react';
import {SafeAreaView} from 'react-native';
import {Container, Header, Title, Text, Tabs, Tab} from 'native-base';

export default class Settings extends React.Component {
  render() {
    return (
      <Tabs tabBarUnderlineStyle={{backgroundColor: 'blue', height: 1}}>
        <Tab />
        <Tab />
      </Tabs>
    );
  }
}
