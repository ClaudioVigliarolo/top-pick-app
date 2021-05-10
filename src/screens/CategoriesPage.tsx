import * as React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Category, Lang} from '../interfaces/Interfaces';
import {getColor} from '../constants/Themes';
import {ThemeContext} from '../context/ThemeContext';
import {LocalizationContext} from '../context/LocalizationContext';
import ListItem from '../components/lists/ListItem';
import {getCategories} from '../utils/sql';

export default function CategoryList({navigation}: {navigation: any}) {
  const [items, setItems] = React.useState<Category[]>([]);
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);

  React.useEffect(() => {
    (async () => {
      console.log('prima');
      const categories: Category[] = await getCategories(
        translations.LANG as Lang,
      );
      console.log('olaola', categories);
      setItems([...categories]);
    })();
  }, [translations.LANG]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: getColor(theme, 'primaryBackground'),
    },
  });
  return (
    <ScrollView style={styles.container}>
      {items.map((item: Category, i) => (
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
