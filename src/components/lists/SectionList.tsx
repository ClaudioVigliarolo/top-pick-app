import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  SectionList,
  PixelRatio,
} from 'react-native';
import {Section, Topic} from '../../interfaces/Interfaces';
import ListItemBasic from './ListItemBasic';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import styles from '../../styles/styles';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import {getFontSize} from '../../constants/theme/Fonts';

interface TopicsSectionListState {}

interface TopicsSectionListProps {
  navigation: any;
  items: Section[];
  sectionListRef: any;
}

export default class TopicsSectionList extends React.PureComponent<
  TopicsSectionListProps,
  TopicsSectionListState
> {
  constructor(props: any) {
    super(props);
    this.getItemLayout = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex, rowIndex) =>
        sectionIndex === 0 ? 100 : 50,

      // These three properties are optional
      getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
      getSectionHeaderHeight: () => 20, // The height of your section headers
      getSectionFooterHeight: () => 10, // The height of your section footers
    });
  }
  static contextType = ThemeContext;
  renderSectionHeader = ({section}: {section: any}) => {
    return (
      <Text
        style={[
          styles.sectionListHeader,
          {
            backgroundColor: getColor(this.context.theme, 'sectionHeader'),
            fontSize: getFontSize(this.context.theme, 'fontBigMed'),
          },
        ]}>
        {section.title}
      </Text>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.sectionListContainer}>
        <SectionList
          initialNumToRender={20}
          keyExtractor={(item) => item.id + ''}
          sections={this.props.items}
          stickySectionHeadersEnabled={true}
          ref={this.props.sectionListRef}
          maxToRenderPerBatch={80}
          renderItem={({item}) => (
            <Item topic={item} navigation={this.props.navigation} />
          )}
          renderSectionHeader={this.renderSectionHeader}
        />
      </SafeAreaView>
    );
  }
}

class Item extends React.PureComponent<any, any> {
  goQuestions = (topic: Topic) => {
    this.props.navigation.navigate('Questions', {
      screen: 'QuestionsScreen',
      params: {
        id: topic.id,
        title: topic.title,
      },
    });
  };
  render() {
    return (
      <ListItemBasic
        text={this.props.topic.title}
        icon={true}
        onPress={() => this.goQuestions(this.props.topic)}
      />
    );
  }
}
