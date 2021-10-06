import React from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {staticFontSizes} from '../../constants/theme/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SkipIcon({onPress}: {onPress: () => void}) {
  return (
    <TouchableOpacity
      style={{position: 'absolute', right: '3%', top: '3%', zIndex: 1000}}
      onPress={onPress}>
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
  );
}
