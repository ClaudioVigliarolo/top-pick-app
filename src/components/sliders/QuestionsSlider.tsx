import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions as Dim,
} from 'react-native';
import {Question} from '../../interfaces/Interfaces';
import {Text, View, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../../styles/styles';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';

interface SliderProps {
  backgroundColor: string;
  title: string;
  items: Question[];
  image: Image | null;
  onClose(): void;
}

const QuestionsSlider = (props: SliderProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  const [sliderState, setSliderState] = React.useState({currentPage: 0});
  const [width, setWidth] = React.useState<number>(Dim.get('window').width);
  const [height, setheight] = React.useState<number>(Dim.get('window').height);

  React.useEffect(() => {
    Dim.addEventListener('change', (e) => {
      const {width, height} = e.window;
      setWidth(width);
      setheight(height);
    });
  }, []);
  const setSliderPage = (event: any) => {
    const {currentPage} = sliderState;
    const {x} = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };
  const {currentPage: pageIndex} = sliderState;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={[
          styles.SliderContainer,
          {backgroundColor: getColor(theme, 'primaryOrange')},
        ]}>
        <View style={styles.SlidertitleSection}>
          <Text style={[styles.Slidertitle]}>{props.title}</Text>
          <AntDesign
            name="close"
            onPress={props.onClose}
            size={35}
            style={{
              color: '#fff',
              position: 'absolute',
              right: '2%',
              top: '5%',
              opacity: 0.7,
            }}
          />
        </View>
        <ScrollView
          style={{flex: 1}}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event: any) => {
            setSliderPage(event);
          }}>
          {props.items.map((item: Question, index: number) => (
            <View key={index} style={{width, height}}>
              <View style={styles.Sliderwrapper}>
                <Text style={[styles.Sliderquestion]}>{item.title}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.SliderpaginationWrapper}>
          {Array.from(Array(props.items.length).keys()).map((key, index) => (
            <View
              style={[
                styles.SliderpaginationDots,
                {opacity: pageIndex === index ? 0.8 : 0.2},
              ]}
              key={index}
            />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

export default QuestionsSlider;
