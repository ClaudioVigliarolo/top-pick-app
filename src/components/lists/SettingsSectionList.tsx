import React from 'react';
import {SafeAreaView} from 'react-native';
import {
  Setting,
  SettingSection,
  SettingType,
} from '../../interfaces/Interfaces';
import ListItemBasic from './ListItemBasic';
import ListItemCheckbox from './ListItemCheckbox';
import styles from '../../styles/styles';
import SectionList from './SectionList';
interface SettingSectionListProps {
  navigation: any;
  items: SettingSection[];
  sectionListRef: any;
}

class Item extends React.PureComponent<any, any> {
  render() {
    switch (this.props.type) {
      case SettingType.BASIC:
        return (
          <ListItemBasic
            text={this.props.title}
            onPress={this.props.onPress}
            icon={false}
          />
        );

      case SettingType.CHECKBOX:
        return (
          <ListItemCheckbox
            text={this.props.title}
            selected={this.props.selected}
            modal={false}
            id={0}
            onSelect={this.props.onPress}
          />
        );

      default:
        console.log('WHYYY', this.props);
        return null;
    }
  }
}

export default function SettingSectionList({
  items,
  navigation,
  sectionListRef,
}: SettingSectionListProps) {
  return (
    <SafeAreaView style={styles.sectionListContainer}>
      <SectionList
        items={items}
        sectionListRef={sectionListRef}
        renderItem={({item}: {item: Setting}) => (
          <Item {...item} navigation={navigation} />
        )}
      />
    </SafeAreaView>
  );
}
