import * as React from 'react';
import {View} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import SearchBar from '../../components/bars/SearchBar';
import {getColor} from '../../constants/theme/Themes';
import {LocalizationContext} from '../../context/LocalizationContext';
import {Lang, Topic} from '../../interfaces/Interfaces';
import CardItem from '../../components/lists/CardItem';
import ButtonsSearch from '../../components/buttons/ButtonsSearch';
import {getPopularTopics, searchByTopic} from '../../utils/sql';
import CONSTANTS from '../../constants/app/App';
import styles from '../../styles/styles';
import {readStorageRecents, saveStorageRecent} from '../../utils/utils';

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
      params: {
        id: topic.id,
        title: topic.title,
      },
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
    let newRecentsTemp: Topic[] = recents;
    //add item to the top of the list
    newRecentsTemp.unshift(newSearchTopic);
    const newRecents = [...new Set(newRecentsTemp)].slice(
      0,
      CONSTANTS.MAX_RECENTS,
    );
    setRecents([...newRecents]);
    saveRecents(newRecents);
  };

  const saveRecents = async (newRecentsArray: Topic[]) => {
    await saveStorageRecent(newRecentsArray, translations.LANG as Lang);
  };

  const getRecents = async () => {
    const retrievedArray = await readStorageRecents(translations.LANG as Lang);
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

  return (
    <View
      style={{flex: 1, backgroundColor: getColor(theme, 'primaryBackground')}}>
      <SearchBar
        setText={(val: string) => {
          setText(val);
          executeSearch(val);
        }}
        text={text}
        placeholder={translations.SEARCH_A_TOPIC}
        automatic={true}
      />
      <View style={{minHeight: 200}}>
        {!text &&
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
        {text !== '' &&
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
      <View style={[styles.DefaultContainer, {}]}>
        <View style={{height: '50%', marginTop: '10%'}}>
          <ButtonsSearch
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
    </View>
  );
};

export default SearchPage;
