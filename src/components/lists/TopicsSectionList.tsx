import React from 'react';
import {SafeAreaView} from 'react-native';
import {TopicSection, Topic} from '../../interfaces/Interfaces';
import ListItemBasic from './ListItemBasic';
import styles from '../../styles/styles';
import SectionList from './SectionList';

interface TopicSectionListProps {
  navigation: any;
  items: TopicSection[];
  sectionListRef: any;
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
        text={this.props.title}
        icon={true}
        onPress={() => this.goQuestions(this.props as any)}
      />
    );
  }
}

export default function TopicSectionList({
  items,
  navigation,
  sectionListRef,
}: TopicSectionListProps) {
  return (
    <SafeAreaView style={styles.sectionListContainer}>
      <SectionList
        items={items}
        sectionListRef={sectionListRef}
        renderItem={({item}: {item: Topic}) => (
          <Item {...item} navigation={navigation} />
        )}
      />
    </SafeAreaView>
  );
}
