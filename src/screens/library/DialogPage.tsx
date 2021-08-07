import {View} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import {getFontSize} from '../../constants/theme/Fonts';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import translations from '../../context/translations';
import styles from '../../styles/styles';

export default function DialogPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const {theme, fontsize} = React.useContext(ThemeContext);

  return (
    <View
      style={[
        styles.DefaultContainerCenter,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      <Text
        style={[
          styles.FavouritesPageText,
          {
            color: getColor(theme, 'primaryOrange'),
            fontSize: getFontSize(fontsize, 'fontMed'),
          },
        ]}>
        {translations.NO_DIALOGS}
      </Text>
    </View>
  );
}
