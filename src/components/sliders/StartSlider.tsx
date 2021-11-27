import * as React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import {Text, View, Image} from 'react-native';
import {staticFontSizes} from '../../constants/theme/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/buttons/CustomButton';
import {Dimensions} from 'react-native';
import styles from '../../styles/styles';
import translations from '../../context/translations';

const StartSlider = ({onDone}: {onDone(): void}) => {
  const {theme} = React.useContext(ThemeContext);
  const [sliderState, setSliderState] = React.useState({currentPage: 0});
  const {width, height} = Dimensions.get('window');

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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: Platform.OS === 'ios' ? 30 : 0,
            }}>
            <Text
              style={{
                color: 'white',
                fontStyle: 'italic',
                fontSize: staticFontSizes.fontMed,
              }}>
              Skip
            </Text>
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
              fadeDuration={5}
              resizeMode="center"
              source={require('../../assets/images/0.png')}
              style={styles.SliderimageStyle}
            />
            <View style={styles.Sliderwrapper}>
              <Text style={styles.Sliderheader}>
                {translations.WELCOME_TOPICK_TITLE}
              </Text>
              <Text style={styles.SliderParagraph}>
                {translations.WELCOME_TOPICK_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../../assets/images/1.png')}
              style={styles.SliderimageStyle}
              resizeMode="center"
            />
            <View style={styles.Sliderwrapper}>
              <Text style={styles.Sliderheader}>
                {translations.STEP_1_TITLE}
              </Text>
              <Text style={styles.SliderParagraph}>
                {translations.STEP_1_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../../assets/images/2.png')}
              style={styles.SliderimageStyle}
              resizeMode="center"
            />
            <View style={styles.Sliderwrapper}>
              <Text style={styles.Sliderheader}>
                {translations.STEP_2_TITLE}
              </Text>
              <Text style={styles.SliderParagraph}>
                {translations.STEP_2_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../../assets/images/3.png')}
              style={styles.SliderimageStyle}
              resizeMode="center"
            />
            <View style={styles.Sliderwrapper}>
              <Text style={styles.Sliderheader}>
                {translations.STEP_3_TITLE}
              </Text>
              <Text style={styles.SliderParagraph}>
                {translations.STEP_3_DESCRIPTION}
              </Text>
            </View>
          </View>

          <View style={{width, height, alignItems: 'center'}}>
            <View style={styles.SliderlastSlide}>
              <Text style={styles.SliderStartAppHeader}>
                {translations.READY_TO_START}
              </Text>
              <Text style={styles.SliderParagraph}>
                {translations.READY_TO_START_TIP}
              </Text>
              <View style={{alignSelf: 'center', width: 200, marginTop: '10%'}}>
                <Button
                  color={getColor(theme, 'lightOrange')}
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

export default StartSlider;
