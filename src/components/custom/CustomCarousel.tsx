import React from 'react';
import {Text, View, Dimensions as Dim} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemeContext} from '../../context/ThemeContext';
import {Topic} from '../../interfaces/Interfaces';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json
import Dimensions from '../../constants/theme/Dimensions';
import {scrollInterpolator, animatedStyles} from '../../utils/animations';
import {useIsFocused} from '@react-navigation/native';
import {getCardTemplate} from '../../constants/theme/Cardtheme';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';

interface CarouselProps {
  carouselItems: Topic[];
  activeIndex: number;
  setIndex: Function;
  onTopicPress: Function;
}

const TopicCarousel = React.forwardRef((props: CarouselProps, ref) => {
  const isFocused = useIsFocused();
  const [color, setColor] = React.useState<string>('orange');
  const [width, setWidth] = React.useState<number>(Dim.get('window').width);
  const [height, setheight] = React.useState<number>(Dim.get('window').height);
  const {theme, fontsize, cardTheme} = React.useContext(ThemeContext);

  let _carousel: any = {};
  const itemWidth = width * Dimensions.CAROUSEL_ITEM_WIDTH_FACTOR;
  const itemHeight = height * Dimensions.CAROUSEL_ITEM_HEIGHT_FACTOR;

  React.useEffect(() => {
    (async () => {
      setColor(getCardTemplate(theme, cardTheme));
    })();

    Dim.addEventListener('change', (e) => {
      const {width, height} = e.window;
      setWidth(width);
      setheight(height);
    });
  }, [isFocused]);

  React.useImperativeHandle(ref, () => ({
    validate() {},
    getCarousel() {
      return _carousel;
    },
  }));

  const _renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => props.onTopicPress(item)}>
        <View
          style={[
            styles.CustomCarouselContainer,
            {
              backgroundColor: color,
              width: itemWidth,
              height: itemHeight,
            },
          ]}>
          <Text
            style={[
              styles.CustomCarouselitemLabel,
              {
                fontSize: getFontSize(fontsize, 'fontBigMed'),
              },
            ]}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Carousel
        renderItem={_renderItem}
        sliderWidth={width}
        itemWidth={itemWidth}
        containerCustomStyle={{marginTop: '10%'}}
        inactiveSlideShift={0}
        scrollInterpolator={scrollInterpolator}
        slideInterpolatedStyle={animatedStyles}
        useScrollView={true}
        ref={(c) => {
          _carousel = c;
        }}
        data={props.carouselItems}
        //sliderHeight={Dimensions.SCREEN_HEIGHT / 1.7}
        itemHeight={Dimensions.SCREEN_HEIGHT / 1.7}
        onSnapToItem={(index) => {
          props.setIndex(index);
        }}
      />
    </View>
  );
});

export default TopicCarousel;
