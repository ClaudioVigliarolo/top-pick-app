import * as React from 'react';
import {View} from 'react-native';
import {Lang, TopicLevel, TopicSection} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import {LAZY_LOAD_TIMEOUT} from '../../constants/app/App';
import {getTopicsByLevel} from '../../utils/sql';
import styles from '../../styles/styles';
import {alphabeticalSectionSort} from '../../utils/sorting';
import SectionList from '../../components/lists/SectionList';

export default function LevelEasyPage({navigation}: {navigation: any}) {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const [data, setData] = React.useState<TopicSection[]>([]);
  const sectionListRef = React.useRef<any>(null);

  React.useEffect(() => {
    (async () => {
      setTimeout(async () => {
        const topics = await getTopicsByLevel(
          translations.LANG as Lang,
          TopicLevel.EASY,
        );
        const topicsSectionList = alphabeticalSectionSort(topics);
        setData(topicsSectionList);
      }, LAZY_LOAD_TIMEOUT);
    })();
  }, [translations.LANG]);

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
