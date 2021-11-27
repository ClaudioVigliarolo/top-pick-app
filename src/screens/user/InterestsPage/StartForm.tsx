import React from 'react';
import {Text, View} from 'react-native';
import {getColor} from '../../../constants/theme/Themes';
import {ThemeContext} from '../../../context/ThemeContext';
import styles from '../../../styles/styles';
import Button from '../../../components/buttons/CustomButton';

export default function StartForm({
  newForm,
  onStart,
}: {
  newForm: boolean;
  onStart: () => void;
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
      <Text
        style={[
          styles.header,
          {
            color: getColor(theme, 'primaryOrange'),
            marginTop: 50,
          },
        ]}>
        {newForm ? 'Personalize your experience' : 'Update the Form here'}
      </Text>
      <Text
        style={[
          styles.subHeader,
          {
            color: getColor(theme, 'lightGrey'),
          },
        ]}>
        We will use the data to show the best topics for you
      </Text>
      <View style={{alignSelf: 'center', width: 200, marginTop: '10%'}}>
        <Button
          color={getColor(theme, 'lightOrange')}
          title="Start the form"
          onPress={onStart}
        />
      </View>
    </View>
  );
}
