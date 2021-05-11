import * as React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styles from '../../styles/styles';

const CustomButton = ({
  onPress,
  title,
  color,
}: {
  onPress: any;
  title: string;
  color: string;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.CustomButtonContainer, {backgroundColor: color}]}>
        <Text style={styles.CustomButtonbuttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
