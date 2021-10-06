import React from 'react';
import {View, Platform, TouchableOpacity} from 'react-native';
import IconBack from 'react-native-vector-icons/MaterialIcons';

export default function BackIcon({onPress}: {onPress: () => void}) {
  return (
    <TouchableOpacity
      style={{position: 'absolute', left: '3%', top: '3%', zIndex: 1000}}
      onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: Platform.OS === 'ios' ? 30 : 0,
        }}>
        <IconBack
          name="arrow-back"
          color="white"
          size={30}
          style={{
            marginLeft: 8,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
