import * as React from 'react';
import {ScrollView} from 'react-native';
import {Topic} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import ListItem from '../../components/lists/ListItemBasic';
import styles from '../../styles/styles';

export default function AllTopicsPage({navigation}: {navigation: any}) {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const [items, setItems] = React.useState<Topic[]>([]);

  React.useEffect(() => {
    (async () => {
      // const topics: Topic[] = await getAllTopics(translations.LANG as Lang);
      // setItems(topics);
    })();
  }, []);

  return (
    <ScrollView
      style={[
        styles.DefaultContainer,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      {items.map((item: Topic, i) => (
        <ListItem key={i} icon={true} text={item.title} onPress={() => {}} />
      ))}
    </ScrollView>
  );
}
