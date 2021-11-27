import * as React from 'react';
import {View} from 'react-native';
import {Lang, TopicLevel, TopicSection} from '../../../interfaces/Interfaces';
import {LocalizationContext} from '../../../context/LocalizationContext';
import {ThemeContext} from '../../../context/ThemeContext';
import {getColor} from '../../../constants/theme/Themes';
import {LAZY_LOAD_TIMEOUT} from '../../../constants/app/App';
import {getTopicsByLevel} from '../../../utils/storage/sql';
import styles from '../../../styles/styles';
import {alphabeticalSectionSort} from '../../../utils/utils/sorting';
import SectionList from '../../../components/lists/TopicsSectionList';

export default function LevelMediumPage({navigation}: {navigation: any}) {
  const {theme} = React.useContext(ThemeContext);
  const {contentLanguage} = React.useContext(LocalizationContext);
  const [data, setData] = React.useState<TopicSection[]>([]);
  const sectionListRef = React.useRef<any>(null);

  React.useEffect(() => {
    (async () => {
      setTimeout(async () => {
        const topics = await getTopicsByLevel(
          contentLanguage,
          TopicLevel.MEDIUM,
        );
        const topicsSectionList = alphabeticalSectionSort(topics);
        setData(topicsSectionList);
      }, LAZY_LOAD_TIMEOUT);
    })();
  }, [contentLanguage]);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <View
        style={[
          styles.DefaultContainer,
          {
            backgroundColor: getColor(theme, 'primaryBackground'),
          },
        ]}>
        <SectionList
          navigation={navigation}
          items={data}
          sectionListRef={sectionListRef}
        />
      </View>
    </View>
  );
}
