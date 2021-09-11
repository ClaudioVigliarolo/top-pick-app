import * as React from 'react';
import {View} from 'react-native';
import {Lang, TopicSection} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import CONSTANTS from '../../constants/app/App';
import {getRecentTopics} from '../../utils/sql';
import styles from '../../styles/styles';
import SectionList from '../../components/lists/SectionList';
import {timeSectionSort} from '../../utils/sorting';

export default function NewTopicsPage({navigation}: {navigation: any}) {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const [data, setData] = React.useState<TopicSection[]>([]);
  const sectionListRef = React.useRef<any>(null);

  React.useEffect(() => {
    (async () => {
      setTimeout(async () => {
        console.log('iottto');
        const topics = await getRecentTopics(translations.LANG as Lang, 200);
        const topicsSectionList = timeSectionSort(topics);
        setData(topicsSectionList);
      }, CONSTANTS.LAZY_LOAD_TIMEOUT);
    })();
  }, []);

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
