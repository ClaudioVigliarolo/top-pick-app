import React, {useRef, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Animated,
  Linking,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

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
const CustomDropDown = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        position: 'absolute',
        top: 10,
        right: 3,
        width: 1000,
        height: 1000,
        // backgroundColor: 'blue',
      }}
      pointerEvents={'auto'}>
      <TouchableWithoutFeedback
        onPress={(e) => {
          onClose();
        }}
        style={{
          height: '100%',
          width: '100%',
        }}>
        <FadeInView
          style={{
            position: 'absolute',
            top: 10,
            right: 3,
            zIndex: 100,
            width: 180,
            borderRadius: 3,
            backgroundColor: 'white',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.8,
            shadowRadius: 1,
          }}>
          <View style={{padding: 15, flex: 1, width: '100%', height: 50}}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '100%',
              }}
              onPress={() => {
                Linking.openURL(
                  "mailto:topick@tech-center.com?subject=Have feedback? Have Bugs to report? We'd love to hear it.",
                );
              }}>
              <Text>Report a problem</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>
      </TouchableWithoutFeedback>
    </View>
  );
};
export default CustomDropDown;
