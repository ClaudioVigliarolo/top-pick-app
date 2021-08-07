import * as React from 'react';
import {ScrollView} from 'react-native';
import {Topic, Category, Lang} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import ListItem from '../../components/lists/ListItemBasic';
import {getTopicByCategory} from '../../utils/sql';
import styles from '../../styles/styles';

export default function TopicsPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const {category}: {category: Category} = route.params;

  React.useEffect(() => {
    (async () => {
      const topics: Topic[] = await getTopicByCategory(
        category.id,
        translations.LANG as Lang,
      );
      setTopics(topics);
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
