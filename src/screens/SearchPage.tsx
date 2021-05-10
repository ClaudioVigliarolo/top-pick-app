import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import AsyncStorage from '@react-native-community/async-storage';
import SearchBar from '../components/search/SearchBar';
import {getColor} from '../constants/Themes';
import {LocalizationContext} from '../context/LocalizationContext';
import {Lang, Topic} from '../interfaces/Interfaces';
import CardItem from '../components/lists/CardItem';
import ButtonsSection from '../components/buttons/ButtonsSearchSection';
import keys from '../../database/keys/keys';
import {getPopularTopics, searchByTopic} from '../utils/sql';
import CONSTANTS from '../constants/App';

const SearchPage = ({navigation}: {navigation: any}) => {
  const [text, setText] = React.useState('');
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const [items, setItems] = React.useState<Topic[]>([]);
  const [popular, setPopular] = React.useState<Topic[]>([]);
  const [recents, setRecents] = React.useState<Topic[]>([]);

  React.useEffect(() => {
    getRecents();
    getPopular();
  }, [translations.LANG]);

  const goQuestionsFromTopic = (topic: Topic): void => {
    navigation.navigate('Questions', {
      screen: 'QuestionsScreen',
      params: {topic},
    });
  };
  const getPopular = async (): Promise<void> => {
    const topics: Topic[] = await getPopularTopics(translations.LANG as Lang);
    topics.map(function (item: Topic) {
      return item['title'];
    });
    setPopular(topics);
  };

  const onChangeRecents = async (newSearchTopic: Topic) => {
    let newRecents: Topic[] = recents;
    //check if contained, if so don't insert and put it to front
    if (newRecents.includes(newSearchTopic)) {
      newRecents = recents.filter((el) => el.title != newSearchTopic.title);
      newRecents.unshift(newSearchTopic);
    } else if (recents.length < CONSTANTS.MAX_RECENTS) {
      newRecents.unshift(newSearchTopic);
    } else {
      //const newRecents = recents.splice(0, MAX_RECENTS - 1);
      newRecents.map((r) => console.log(r.title));
      newRecents.unshift(newSearchTopic);
      newRecents = newRecents.slice(0, CONSTANTS.MAX_RECENTS);
      newRecents.map((r) => console.log(r.title));
    }
    setRecents([...newRecents]);
    saveRecents(newRecents);
  };

  const saveRecents = async (newRecentsArray: Topic[]) => {
    try {
      await AsyncStorage.setItem(
        keys.RECENT_SEARCH_KEY + translations.LANG,
        JSON.stringify(newRecentsArray),
      );
    } catch (error) {}
  };

  const getRecents = async () => {
    console.log('calling get rec', translations.LANG);
    try {
      const retrievedArray = await AsyncStorage.getItem(
        keys.RECENT_SEARCH_KEY + translations.LANG,
      );
      if (retrievedArray !== null) {
        // We have data!!
        const recentsArray: Topic[] = JSON.parse(retrievedArray).map(
          (el: Topic) => {
            if (el.lang === translations.LANG) return el;
          },
        );
        const newRecents =
          recentsArray.length > CONSTANTS.MAX_RECENTS
            ? recentsArray.slice(0, CONSTANTS.MAX_RECENTS)
            : recentsArray;
        setRecents(newRecents.filter((e) => e));
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const executeSearch = async (param: string): Promise<void> => {
    if (param == '') {
      setItems([]);
      return;
    }
    const topics: Topic[] = await searchByTopic(
      param,
      translations.LANG as Lang,
    );
    setItems(topics);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: getColor(theme, 'primaryBackground'),
    },
    buttonsContainer: {
      marginTop: '10%',
    },
  });

  return (
    <React.Fragment>
      <SearchBar
        setText={(val: string) => {
          setText(val);
          executeSearch(val);
        }}
        text={text}
        placeholder={translations.SEARCH_A_TOPIC}
        automatic={true}
      />
      <View>
        {text == '' &&
          recents.map((recent: Topic, i) => (
            <CardItem
              key={i}
              text={recent.title}
              color={getColor(theme, 'primaryOrange')}
              type="topic"
              onPress={() => {
                goQuestionsFromTopic(recent);
                onChangeRecents(recent);
                setText('');
              }}
            />
          ))}
        {text != '' &&
          items.map((item: Topic, i) => (
            <CardItem
              key={i}
              text={item.title}
              color={getColor(theme, 'primaryOrange')}
              type="topic"
              onPress={() => {
                goQuestionsFromTopic(item);
                onChangeRecents(item);
                setText('');
              }}
            />
          ))}
      </View>
      <View style={styles.container}>
        <View style={{height: '50%', marginTop: '20%'}}>
          <ButtonsSection
            buttons={popular}
            header={translations.POPULAR_SEARCHES}
            onSearch={(topic: Topic) => {
              goQuestionsFromTopic(topic);
              onChangeRecents(topic);
              setText('');
            }}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

export default SearchPage;
