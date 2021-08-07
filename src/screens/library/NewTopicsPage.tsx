import * as React from 'react';
import {ScrollView} from 'react-native';
import {Topic, Category, Lang} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import ListItem from '../../components/lists/ListItemBasic';
import CONSTANTS from '../../constants/app/App';
import {getRecentTopics} from '../../utils/sql';
import styles from '../../styles/styles';

export default function NewTopicsPage({navigation}: {navigation: any}) {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const [topics, setItems] = React.useState<Topic[]>([]);

  React.useEffect(() => {
    (async () => {
      setTimeout(async () => {
        console.log('iottto');
        const topics = await getRecentTopics(
          translations.LANG as Lang,
          0,
          CONSTANTS.RECENT_LOADED_N,
        );
        console.log('icccole', topics);
        setItems(topics);
      }, CONSTANTS.LAZY_LOAD_TIMEOUT);
    })();
  }, []);

  return (
    <ScrollView
      style={[
        styles.DefaultContainer,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      {topics.map((topic: Topic, i) => (
        <ListItem
          key={i}
          icon={true}
          text={topic.title}
          onPress={() => {
            navigation.navigate('Questions', {
              screen: 'QuestionsScreen',
              params: {
                title: topic.title,
                id: topic.id,
              },
            });
          }}
        />
      ))}
    </ScrollView>
  );
}
