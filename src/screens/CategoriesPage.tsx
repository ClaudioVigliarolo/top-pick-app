import * as React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Category} from '../interfaces/Interfaces';
import {getColor} from '../constants/Themes';
import {ThemeContext} from '../context/ThemeContext';
import {LocalizationContext} from '../context/LocalizationContext';
import ListItem from '../components/lists/ListItem';
import {getDB} from '../utils/utils';

export default function CategoryList({navigation}: {navigation: any}) {
  const [items, setItems] = React.useState<Category[]>([]);
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);

  React.useEffect(() => {
    getDB().transaction((tx) => {
      tx.executeSql(
        ` SELECT c2.title, c2.id,  count(*) as counter
        FROM category_topics c1,  categories c2 
        WHERE c1.lang = "${translations.LANG}" AND c2.lang = "${translations.LANG}" AND c2.id = (
        SELECT c3.id
        FROM categories c3
        WHERE  c3.id = c1.category_id
        )
		  GROUP BY c1.category_id
      `,
        [],
        (tx, results) => {
          const rows = results.rows;
          console.log('URSS', rows);
          let newArr = [];

          for (let i = 0; i < rows.length; i++) {
            newArr.push({
              ...rows.item(i),
            });
          }
          console.log('tuttttt', newArr);

          setItems([...newArr]);
        },
        (err) => {
          console.log(err);
        },
      );
    });
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
