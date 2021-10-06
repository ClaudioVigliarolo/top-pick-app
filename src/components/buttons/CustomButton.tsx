import * as React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {staticFontSizes} from '../../constants/theme/Fonts';
import styles from '../../styles/styles';

const CustomButton = ({
  onPress,
  title,
  color,
  loading,
}: {
  onPress: () => void;
  title: string;
  color: string;
  loading?: boolean;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} disabled={loading}>
      <View
        style={[
          styles.CustomButtonContainer,
          {backgroundColor: color, opacity: loading ? 0.5 : 1},
        ]}>
        <Text
          style={[
            styles.CustomButtonbuttonText,
            {
              fontSize: staticFontSizes.fontMed,
            },
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
