import * as React from 'react';
import {
  PixelRatio,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {LocalizationContext} from '../context/LocalizationContext';
import {getColor} from '../constants/theme/Themes';
import {ThemeContext} from '../context/ThemeContext';
import {Text, View, StyleSheet, Image} from 'react-native';
import {staticFontSizes} from '../constants/theme/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../components/buttons/CustomButton';
import {Dimensions} from 'react-native';

const StartSlides = ({onDone}: {onDone(): void}) => {
  const {theme} = React.useContext(ThemeContext);
  const [sliderState, setSliderState] = React.useState({currentPage: 0});
  const {translations} = React.useContext(LocalizationContext);
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

  const styles = StyleSheet.create({
    imageStyle: {
      height: '50%',
      width: '100%',
    },
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 30,
      width: '80%',
      alignSelf: 'center',
    },
    header: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: '5%',
      textAlign: 'center',
      color: '#fff',
    },
    lastSlideHeader: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#fff',
    },
    paragraph: {
      fontSize: staticFontSizes.fontMed,
      textAlign: 'center',
      color: '#fff',
    },
    paginationWrapper: {
      position: 'absolute',
      bottom: '5%',
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    paginationDots: {
      height: 10,
      width: 10,
      borderRadius: 10 / 2,
      backgroundColor: 'white',
      marginLeft: 10,
    },
    lastSlide: {
      flex: 1,
      width: '80%',
      alignSelf: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

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
              alignItems: 'center',
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
              resizeMode="center"
              source={require('../assets/images/0.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>
                {translations.WELCOME_TOPICK_TITLE}
              </Text>
              <Text style={styles.paragraph}>
                {translations.WELCOME_TOPICK_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../assets/images/1.png')}
              style={styles.imageStyle}
              resizeMode="center"
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{translations.STEP_1_TITLE}</Text>
              <Text style={styles.paragraph}>
                {translations.STEP_1_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../assets/images/2.png')}
              style={styles.imageStyle}
              resizeMode="center"
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{translations.STEP_2_TITLE}</Text>
              <Text style={styles.paragraph}>
                {translations.STEP_2_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Image
              source={require('../assets/images/3.png')}
              style={styles.imageStyle}
              resizeMode="center"
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>{translations.STEP_3_TITLE}</Text>
              <Text style={styles.paragraph}>
                {translations.STEP_3_DESCRIPTION}
              </Text>
            </View>
          </View>

          <View style={{width, height, alignItems: 'center'}}>
            <View style={styles.lastSlide}>
              <Text style={styles.lastSlideHeader}>
                {translations.READY_TO_START}
              </Text>
              <Text style={styles.paragraph}>
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
        <View style={styles.paginationWrapper}>
          {Array.from(Array(5).keys()).map((key, index) => (
            <View
              style={[
                styles.paginationDots,
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
