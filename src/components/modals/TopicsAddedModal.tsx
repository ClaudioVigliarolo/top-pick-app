import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Animated, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';

const FadeInView = (props: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      duration: 300,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>
  );
};

// You can then use your `FadeInView` in place of a `View` in your components:
const CustomDropDown = ({open, n}: {open: boolean; n: number}) => {
  const navigation = useNavigation();
  const {theme} = React.useContext(ThemeContext);
  return (
    <FadeInView
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 100,
        width: 130,
        borderRadius: 3,
        backgroundColor: getColor(theme, 'lighterOrange'),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 1,
      }}>
      <View style={{padding: 15, flex: 1, width: '100%', height: 80}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Library', {
              screen: 'LibraryScreen',
              params: {
                index: 3,
              },
            })
          }>
          <Text style={{color: 'white', fontSize: 20}}>+ {n} topics !</Text>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              textDecorationLine: 'underline',
              textAlign: 'center',
            }}>
            View
          </Text>
        </TouchableOpacity>
      </View>
    </FadeInView>
  );
};
export default CustomDropDown;
