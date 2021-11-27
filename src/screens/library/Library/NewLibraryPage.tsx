import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import styles from '../../../styles/styles';
import LibraryItem from './LibraryItem';
import {getColor} from '../../../constants/theme/Themes';
import {ThemeContext} from '../../../context/ThemeContext';

export default function NewLibraryPage({navigation}: {navigation: any}) {
  const {theme} = React.useContext(ThemeContext);

  return (
    <ScrollView
      style={[
        styles.DefaultContainer,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      <View>
        <Text
          style={[
            styles.header,
            {
              color: getColor(theme, 'primaryOrange'),
              marginTop: 30,
              marginBottom: 30,
            },
          ]}>
          Explore the Library
        </Text>
      </View>
      <LibraryItem
        destination="Categories"
        navigation={navigation}
        title="Categories"
        description="Explore all the categories"
        image={require('../../../assets/images/category.png')}
      />

      <LibraryItem
        destination="AllTopics"
        navigation={navigation}
        title="Topics"
        description="Explore all the topics"
        image={require('../../../assets/images/category.png')}
      />
      <LibraryItem
        destination="NewTopics"
        navigation={navigation}
        title="New Topics"
        description="New new added topics"
        image={require('../../../assets/images/new.png')}
        imageSize={40}
      />
      <LibraryItem
        destination="Levels"
        navigation={navigation}
        title="Levels"
        description="Explore the topics by level"
        image={require('../../../assets/images/levels.png')}
      />
    </ScrollView>
  );
}
