import * as React from 'react';
import {ScrollView} from 'react-native';
import {Category} from '../../../interfaces/Interfaces';
import {getColor} from '../../../constants/theme/Themes';
import {ThemeContext} from '../../../context/ThemeContext';
import {LocalizationContext} from '../../../context/LocalizationContext';
import ListItem from '../../../components/lists/ListItemBasic';
import {getCategories} from '../../../utils/storage/sql';
import styles from '../../../styles/styles';

export default function CategoryList({navigation}: {navigation: any}) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const {theme} = React.useContext(ThemeContext);
  const {contentLanguage} = React.useContext(LocalizationContext);

  React.useEffect(() => {
    (async () => {
      const categories: Category[] = await getCategories(contentLanguage);
      setCategories([...categories]);
    })();
  }, [contentLanguage]);

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
              //LibraryDetail
              category: item,
            })
          }
        />
      ))}
    </ScrollView>
  );
}
