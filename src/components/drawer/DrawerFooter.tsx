import {Footer} from 'native-base';
import React from 'react';
import {Text, TouchableWithoutFeedback, Platform, Linking} from 'react-native';
import {getColor} from '../../constants/theme/Themes';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import styles from '../../styles/styles';

const openStore = async () => {
  if (Platform.OS === 'ios') {
    Linking.openURL(
      'https://apps.apple.com/us/app/top-pick-find-great-topics/id1571806777',
    );
  } else {
    Linking.openURL('market://details?id=com.topick');
  }
};

export default function DrawerFooter() {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  return (
    <Footer
      style={[
        styles.CustomDrawerFooterContainer,
        {backgroundColor: getColor(theme, 'lighterOrange')},
      ]}>
      <TouchableWithoutFeedback
        onPress={() => {
          openStore();
        }}>
        <Text style={styles.CustomDrawerfooterText}>
          {translations.LEAVE_RATING}
        </Text>
      </TouchableWithoutFeedback>
    </Footer>
  );
}
