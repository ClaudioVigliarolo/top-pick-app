import {Button} from 'native-base';
import {Spinner} from 'native-base';
import * as React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {staticFontSizes} from '../../constants/theme/Fonts';
import styles from '../../styles/styles';

const CustomButton = ({
  onPress,
  title,
  color,
  loading,
  minWidth = 50,
}: {
  onPress: () => void;
  title: string;
  color: string;
  loading?: boolean;
  minWidth?: number | string;
}) => {
  return (
    <Button
      onPress={onPress}
      disabled={loading}
      style={[
        styles.CustomButtonContainer,
        {minWidth},
        {backgroundColor: color, opacity: loading ? 0.8 : 1},
      ]}>
      {loading && (
        <View style={styles.absoluteCenter}>
          <Spinner color="white" />
        </View>
      )}
      <Text
        style={[
          styles.CustomButtonbuttonText,
          {
            fontSize: staticFontSizes.fontMed,
            opacity: loading ? 0 : 1,
          },
        ]}>
        {title}
      </Text>
    </Button>
  );
};

export default CustomButton;
