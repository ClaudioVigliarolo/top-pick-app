import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions as Dim,
  TouchableOpacity,
} from 'react-native';
import {LocalizationContext} from '../context/LocalizationContext';
import {getColor} from '../constants/Themes';
import {ThemeContext} from '../context/ThemeContext';
import {Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../components/buttons/CustomButton';
import styles from '../styles/styles';

const StartSlides = ({onDone}: {onDone(): void}) => {
  const {theme} = React.useContext(ThemeContext);
  const [sliderState, setSliderState] = React.useState({currentPage: 0});
  const {translations} = React.useContext(LocalizationContext);
  const {width, height} = Dim.get('window');

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
      <SafeAreaView style={{flex: 1, zIndex: 1000000}}>
        <TouchableOpacity
          style={{position: 'absolute', right: '3%', top: '3%', zIndex: 1000}}
          onPress={onDone}>
          <View style={styles.StartSliderContainer}>
            <Text style={styles.StartSliderSkipButton}>Skip</Text>
            <Icon
              style={{marginLeft: 5}}
              name="play-skip-forward-outline"
              size={20}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: getColor(theme, 'primaryOrange'),
          }}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event: any) => {
            setSliderPage(event);
          }}>
          <View style={{width, height}}>
            <Image
              resizeMode="center"
              source={require('../assets/images/0.png')}
              style={styles.SliderimageStyle}
            />
            <View style={styles.Sliderwrapper}>
              <Text style={styles.StartSliderheader}>
                {translations.WELCOME_TOPICK_TITLE}
              </Text>
              <Text style={styles.StartSliderparagraph}>
                {translations.WELCOME_TOPICK_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../assets/images/1.png')}
              style={styles.SliderimageStyle}
              resizeMode="center"
            />
            <View style={styles.StartSliderWrapper}>
              <Text style={styles.StartSliderheader}>
                {translations.STEP_1_TITLE}
              </Text>
              <Text style={styles.StartSliderparagraph}>
                {translations.STEP_1_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../assets/images/2.png')}
              style={styles.SliderimageStyle}
              resizeMode="center"
            />
            <View style={styles.StartSliderWrapper}>
              <Text style={styles.StartSliderheader}>
                {translations.STEP_2_TITLE}
              </Text>
              <Text style={styles.StartSliderparagraph}>
                {translations.STEP_2_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../assets/images/3.png')}
              style={styles.SliderimageStyle}
              resizeMode="center"
            />
            <View style={styles.StartSliderWrapper}>
              <Text style={styles.StartSliderheader}>
                {translations.STEP_3_TITLE}
              </Text>
              <Text style={styles.StartSliderparagraph}>
                {translations.STEP_3_DESCRIPTION}
              </Text>
            </View>
          </View>

          <View style={{width, height, alignItems: 'center'}}>
            <View style={styles.StartSliderlastSlide}>
              <Text style={styles.StartSliderlastSlideHeader}>
                {translations.READY_TO_START}
              </Text>
              <Text style={styles.StartSliderparagraph}>
                {translations.READY_TO_START_TIP}
              </Text>
              <View style={{alignSelf: 'center', width: 200, marginTop: '10%'}}>
                <Button
                  color={getColor(theme, 'lighterOrange')}
                  title={translations.START}
                  onPress={onDone}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.SliderpaginationWrapper}>
          {Array.from(Array(5).keys()).map((key, index) => (
            <View
              style={[
                styles.SliderpaginationDots,
                {opacity: pageIndex === index ? 1 : 0.2},
              ]}
              key={index}
            />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

export default StartSlides;
