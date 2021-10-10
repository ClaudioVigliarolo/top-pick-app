import * as React from 'react';
import {View} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import SearchBar from '../../components/bars/SearchBar';
import {getColor} from '../../constants/theme/Themes';
import {LocalizationContext} from '../../context/LocalizationContext';
import {Lang, Topic, TopicType} from '../../interfaces/Interfaces';
import CardItem from '../../components/lists/CardItem';
import ButtonsSearch from '../../components/buttons/ButtonsSearch';
import {getPopularTopics, searchByTopic} from '../../utils/sql';
import {MAX_RECENTS} from '../../constants/app/App';
import {getStorageRecents, setStorageRecent} from '../../utils/storage';
import styles from '../../styles/styles';
import {getTopicTypeLabel} from '../../utils/utils';
import {updateFirebaseSettings} from '../../utils/firebase';
import {AuthContext} from '../../context/AuthContext';

const SearchPage = ({navigation}: {navigation: any}) => {
  const [text, setText] = React.useState('');
  const {theme} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);
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
    const newRecents = [...new Set(newRecentsTemp)].slice(0, MAX_RECENTS);
    setRecents([...newRecents]);
    saveRecents(newRecents);
  };

  const saveRecents = async (newRecentsArray: Topic[]) => {
    await setStorageRecent(newRecentsArray, translations.LANG as Lang);
    if (user) {
      await updateFirebaseSettings(user);
    }
  };

  const getRecents = async () => {
    const retrievedArray = await getStorageRecents(translations.LANG as Lang);
    if (retrievedArray !== null) {
      const parsedArray: Topic[] = JSON.parse(retrievedArray);
      const newRecents =
        parsedArray.length > MAX_RECENTS
          ? parsedArray.slice(0, MAX_RECENTS)
          : parsedArray;
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
              type={getTopicTypeLabel(recent.type as TopicType)}
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
              type={getTopicTypeLabel(item.type as TopicType)}
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
