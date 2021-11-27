import React from 'react';
import {Text, View} from 'react-native';
import {getColor} from '../../../constants/theme/Themes';
import {ThemeContext} from '../../../context/ThemeContext';
import styles from '../../../styles/styles';
import Button from '../../../components/buttons/CustomButton';
import BackIcon from '../../../components/icons/BackIcon';

export default function EndForm({
  onSubmit,
  goBack,
  loading,
}: {
  onSubmit: () => void;
  goBack: () => void;
  loading: boolean;
}) {
  const {theme} = React.useContext(ThemeContext);
  return (
    <View
      style={[
        styles.DefaultContainer,
        {
          backgroundColor: getColor(theme, 'primaryBackground'),
          padding: 30,
        },
      ]}>
      <BackIcon
        color={getColor(theme, 'primaryOrange')}
        onPress={goBack}
        left="3%"
        top="3%"
      />
      <Text
        style={[
          styles.header,
          {
            color: getColor(theme, 'primaryOrange'),
            marginTop: 50,
          },
        ]}>
        Well done you completed the form
      </Text>
      <Text
        style={[
          styles.subHeader,
          {
            color: getColor(theme, 'lightGrey'),
          },
        ]}>
        Click on the button below to confirm your choice
      </Text>
      <View style={{alignSelf: 'center', marginTop: '10%'}}>
        <Button
          color={getColor(theme, 'lightOrange')}
          title="Submit the form"
          loading={loading}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
}
