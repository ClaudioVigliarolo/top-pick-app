import React from 'react';
import {View, Platform, TouchableOpacity} from 'react-native';
import IconBack from 'react-native-vector-icons/MaterialIcons';

export default function BackIcon({
  onPress,
  left,
  top,
  color,
}: {
  onPress: () => void;
  left: string | number;
  top: string | number;
  color: string;
}) {
  return (
    <TouchableOpacity
      style={{position: 'absolute', left, top, zIndex: 1000}}
      onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: Platform.OS === 'ios' ? 30 : 0,
        }}>
        <IconBack name="arrow-back" color={color} size={30} />
      </View>
    </TouchableOpacity>
  );
}
