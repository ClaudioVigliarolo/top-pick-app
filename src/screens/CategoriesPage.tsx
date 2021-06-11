import * as React from 'react';
import {ScrollView} from 'react-native';
import {Category, Lang} from '../interfaces/Interfaces';
import {getColor} from '../constants/theme/Themes';
import {ThemeContext} from '../context/ThemeContext';
import {LocalizationContext} from '../context/LocalizationContext';
import ListItem from '../components/lists/ListItemBasic';
import {getCategories} from '../utils/sql';
import styles from '../styles/styles';

export default function CategoryList({navigation}: {navigation: any}) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);

  React.useEffect(() => {
    (async () => {
      console.log('prima');
      const categories: Category[] = await getCategories(
        translations.LANG as Lang,
      );
      setCategories([...categories]);
    })();
  }, [translations.LANG]);

  return (
    <ScrollView
      style={[
        styles.DefaultContainer,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      {categories.map((item: Category, i) => (
        <ListItem
          key={i}
          icon={true}
          secondaryText={item.counter}
          text={item.title}
          onPress={() =>
            navigation.navigate('Topics', {
              category: item,
            })
          }
        />
      ))}
    </ScrollView>
  );
}
