import * as React from 'react';
import {View, SafeAreaView} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {Lang, Topic} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import TopicsCarousel from '../../components/carousels/CustomCarousel';
import Button from '../../components/buttons/CustomButton';
import {getColor} from '../../constants/theme/Themes';
import {getTopics} from '../../utils/sql';
import {
  INITIALS_TOPICS_LOADED,
  NEW_TOPICS_LOADED,
} from '../../constants/app/App';
import {TAB_HEIGTH} from '../../constants/theme/Dimensions';

const HomePage = ({navigation}: {navigation: any}) => {
  const mycarousel = React.useRef<any>(null);
  const [carouselItems, setCarouselItems] = React.useState<Topic[]>([]);
  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  React.useEffect(() => {
    setCarouselItems(carouselItems.splice(0, carouselItems.length));
    loadTopics(INITIALS_TOPICS_LOADED);
  }, [translations.LANG]);

  const loadTopics = async (n: number): Promise<void> => {
    const topics: Topic[] = await getTopics(n, translations.LANG as Lang);
    setCarouselItems([...carouselItems, ...topics]);
  };

  const getNewTopics = (n: number): void => {
    console.log('my nn', n);
    if (carouselItems.length == n + 1) {
      loadTopics(NEW_TOPICS_LOADED);
    }
  };

  const goQuestionsPage = (topic: Topic): void => {
    navigation.navigate('Questions', {
      screen: 'QuestionsScreen',
      params: {
        id: topic.id,
        title: topic.title,
      },
    });
  };

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
          marginBottom: TAB_HEIGTH,
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
