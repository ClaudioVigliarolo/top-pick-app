import * as React from 'react';
import {View, SafeAreaView, Alert} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {Topic} from '../interfaces/Interfaces';
import {LocalizationContext} from '../context/LocalizationContext';
import TopicsCarousel from '../components/custom/CustomCarousel';
import Button from '../components/buttons/CustomButton';
import Dimensions from '../constants/Dimensions';
import {getColor} from '../constants/Themes';
import {getDB} from '../utils/utils';
import {StatusContext} from '../context/StatusContext';

const INITIALS_TOPICS_LOADED = 10;
const NEW_TOPICS_LOADED = 10;

const HomePage = ({navigation}: {navigation: any}) => {
  const mycarousel = React.useRef(null);
  const [carouselItems, setCarouselItems] = React.useState<Topic[]>([]);
  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const {theme} = React.useContext(ThemeContext);
  const {translations, configureLanguage} = React.useContext(
    LocalizationContext,
  );
  const {isLoadingContent} = React.useContext(StatusContext);

  React.useEffect(() => {
    configureLanguage();
    setCarouselItems(carouselItems.splice(0, carouselItems.length));
    loadTopics(INITIALS_TOPICS_LOADED);
  }, [translations.LANG]);

  const loadTopics = async (n: number): Promise<void> => {
    getDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * from topics
         WHERE lang = "${translations.LANG}"
         ORDER BY RANDOM()
         LIMIT ${n};`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let newArr = carouselItems;
          for (let i = 0; i < rows.length; i++) {
            newArr.push({
              ...rows.item(i),
            });
          }
          console.log('setting new items');
          setCarouselItems([...newArr]);
        },
        (err) => {
          console.log(err);
        },
      );
    });
  };

  const getNewTopics = (n: number): void => {
    if (carouselItems.length == n + 1) {
      loadTopics(NEW_TOPICS_LOADED);
    }
  };

  const goQuestionsPage = (topic: Topic): void => {
    navigation.navigate('Questions', {
      screen: 'QuestionsScreen',
      params: {topic},
    });
  };
  {
    console.log(translations.LANG);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getColor(theme, 'primaryBackground'),
      }}>
      <View
        style={{
          flex: 6,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <TopicsCarousel
          setIndex={(index: number) => {
            setCarouselIndex(index);
            getNewTopics(index);
          }}
          onTopicPress={(topic: Topic) => goQuestionsPage(topic)}
          activeIndex={carouselIndex}
          ref={mycarousel}
          carouselItems={carouselItems}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          minWidth: 250,
          width: '100%',
          marginBottom: Dimensions.tabHeight,
          justifyContent: 'center',
        }}>
        <Button
          color={getColor(theme, 'primaryOrange')}
          title={translations.PICK_TOPIC}
          onPress={() => {
            mycarousel.current && mycarousel.current.getCarousel().snapToNext();
            getNewTopics(carouselIndex + 1);
            setCarouselIndex(carouselIndex + 1);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
