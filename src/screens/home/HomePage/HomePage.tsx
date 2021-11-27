import * as React from 'react';
import {View, SafeAreaView} from 'react-native';
import {ThemeContext} from '../../../context/ThemeContext';
import {Lang, Topic} from '../../../interfaces/Interfaces';
import {LocalizationContext} from '../../../context/LocalizationContext';
import TopicsCarousel from '../../../components/carousels/CustomCarousel';
import Button from '../../../components/buttons/CustomButton';
import {getColor} from '../../../constants/theme/Themes';
import {getTopics} from '../../../utils/storage/sql';
import {
  INITIALS_TOPICS_LOADED,
  NEW_TOPICS_LOADED,
} from '../../../constants/app/App';
import {TAB_HEIGTH} from '../../../constants/theme/Dimensions';
import translations from '../../../context/translations';
import {StatusContext} from '../../../context/StatusContext';

const HomePage = ({navigation}: {navigation: any}) => {
  const mycarousel = React.useRef<any>(null);
  const [carouselItems, setCarouselItems] = React.useState<Topic[]>([]);
  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const {theme} = React.useContext(ThemeContext);
  const {contentLanguage} = React.useContext(LocalizationContext);
  const {forceRefresh} = React.useContext(StatusContext);
  React.useEffect(() => {
    setCarouselItems(carouselItems.splice(0, carouselItems.length));
    loadTopics(INITIALS_TOPICS_LOADED);
  }, [contentLanguage, forceRefresh]);

  const loadTopics = async (n: number): Promise<void> => {
    const topics: Topic[] = await getTopics(n, contentLanguage as Lang);
    setCarouselItems([...carouselItems, ...topics]);
  };

  const getNewTopics = (n: number): void => {
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
  console.log(contentLanguage);
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
