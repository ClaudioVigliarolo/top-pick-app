import * as React from 'react';
import {ScrollView} from 'react-native';
import {Topic, Category, Lang} from '../interfaces/Interfaces';
import {LocalizationContext} from '../context/LocalizationContext';
import {ThemeContext} from '../context/ThemeContext';
import {getColor} from '../constants/Themes';
import ListItem from '../components/lists/ListItemBasic';
import {getTopicByCategory} from '../utils/sql';
import styles from '../styles/styles';

export default function TopicsPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const [items, setItems] = React.useState<Topic[]>([]);
  const {category}: {category: Category} = route.params;

  React.useEffect(() => {
    (async () => {
      const topics: Topic[] = await getTopicByCategory(
        category.id,
        translations.LANG as Lang,
      );
      setItems(topics);
    })();
  }, []);

  return (
    <ScrollView
      style={[
        styles.DefaultContainer,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      {items.map((item: Topic, i) => (
        <ListItem
          key={i}
          secondaryText=""
          icon={true}
          text={item.title}
          onPress={() => {
            navigation.navigate('Questions', {
              screen: 'QuestionsScreen',
              params: {topic: item},
            });
          }}
        />
      ))}
    </ScrollView>
  );
}
