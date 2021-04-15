import * as React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  LayoutAnimation,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {Question, Topic} from '../interfaces/Interfaces';
import {LocalizationContext} from '../context/LocalizationContext';
import {getColor} from '../constants/Themes';
import ListItem from '../components/lists/ListItemCheckbox';
import BottomButton from '../components/buttons/BottomButtons';
import SearchBar from '../components/search/SearchBar';
import Clipboard from '@react-native-community/clipboard';
import Dimensions from '../constants/Dimensions';
import {getDB} from '../utils/utils';

export default function QuestionsPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const [items, setItems] = React.useState<Question[]>([]);
  const [related, setRelated] = React.useState<Topic[]>([]);
  const [filter, setFilter] = React.useState('');
  const [counter, setCounter] = React.useState(0);
  const {theme} = React.useContext(ThemeContext);
  const [isCopyShown, setShowCopy] = React.useState(false);
  const {translations} = React.useContext(LocalizationContext);

  const {topic}: {topic: Topic} = route.params;

  React.useEffect(() => {
    getDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * from questions
          WHERE topic_id = "${topic.id}";`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let newArr = [];
          for (let i = 0; i < rows.length; i++) {
            newArr.push({
              ...rows.item(i),
            });
          }
          newArr.forEach(function (element: Question) {
            element['selected'] = false;
          });
          setItems(newArr);
        },
        (err) => {
          console.error(err);
        },
      );
    });
    //get related topics
    getDB().transaction((tx) => {
      tx.executeSql(
        `
            SELECT * from  topics
            WHERE id IN ( 
            SELECT  dest_id
            FROM related
            WHERE source_id="${topic.id}")`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let newArr = [];
          for (let i = 0; i < rows.length; i++) {
            newArr.push({
              ...rows.item(i),
            });
          }
          setRelated(newArr);
        },
        (err) => {
          console.error(err);
        },
      );
    });
  }, [topic.id]);

  const onSubmit = (): void => {
    const newQuestions: Question[] = [];
    items.forEach(function (element: Question) {
      element['selected'] && newQuestions.push(element);
    });
    navigation.navigate('Order', {
      questions: newQuestions,
      topic,
    });
  };

  const onValChange = (index: number): void => {
    let itemsCopy = [...items];
    itemsCopy[index]['selected'] = !itemsCopy[index]['selected'];
    itemsCopy[index]['selected']
      ? setCounter(counter + 1)
      : setCounter(counter - 1);
    setItems(itemsCopy.slice());
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: getColor(theme, 'primaryBackground'),
    },
    counter: {
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold',
      position: 'absolute',
      top: -50,
      zIndex: 1000,
    },
    related: {
      color: getColor(theme, 'primaryOrange'),
      textAlign: 'left',
      paddingLeft: 10,
      paddingTop: 5,
      textTransform: 'uppercase',
      textDecorationLine: 'underline',
    },
    title: {
      color: getColor(theme, 'lightGray'),
      textAlign: 'left',
      paddingLeft: '3%',
      paddingTop: 5,
      textTransform: 'uppercase',
      fontStyle: 'italic',
      fontSize: Dimensions.fontSmall,
    },
    source: {
      color: getColor(theme, 'lightGray'),
      textAlign: 'left',
      paddingLeft: '3%',
      paddingTop: 5,
      textTransform: 'uppercase',
      fontSize: Dimensions.fontSmall,
    },
    relatedContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      flex: 1,
    },
  });
  {
    console.log(topic);
  }
  return (
    <React.Fragment>
      <SearchBar
        setText={(val: string) => {
          setFilter(val);
        }}
        text={filter}
        placeholder={translations.SEARCH_IN + ' ' + topic.title}
        automatic={false}
      />
      <ScrollView style={styles.container}>
        <View
          style={{
            backgroundColor: getColor(theme, 'primaryBackground'),
            flexDirection: 'column',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>
              {translations.SOURCE_TOPICS + '  '}
            </Text>
            <Text style={styles.source}>{topic.source}</Text>
          </View>
          <View style={styles.relatedContainer}>
            <Text style={styles.title}>
              {translations.RELATED_TOPICS + ' '}
            </Text>
            {related.map((related: Topic) => (
              <TouchableOpacity
                key={related.id}
                onPress={() => {
                  navigation.push('Questions', {
                    screen: 'QuestionsScreen',
                    params: {topic: related},
                  });
                }}>
                <Text style={styles.related}>{related.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {items.map((item: Question, i) => {
          if (item.title.toLowerCase().includes(filter.toLowerCase())) {
            return (
              <ListItem
                key={i}
                editable={true}
                onPress={() => {
                  Clipboard.setString(item.title);
                  setShowCopy(true);
                  setTimeout(function () {
                    setShowCopy(false);
                  }, 2000);
                }}
                text={item.title}
                id={item.id}
                topic={topic.title}
                onValChange={(newVal: boolean) => onValChange(i)}
                value={item.selected ? true : false}
              />
            );
          }
        })}
      </ScrollView>

      <View
        style={{maxHeight: counter > 0 ? Dimensions.bottomButtonsHeight : 0}}>
        <BottomButton
          onPress={onSubmit}
          text={translations.NEXT}
          isTextEnabled={counter > 0}
          secondaryText={translations.SELECTED + ' ' + counter}
          isButtonEnabled={counter > 0}
          visible={counter > 0}
        />
      </View>
    </React.Fragment>
  );
}
