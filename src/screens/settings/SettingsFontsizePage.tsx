import React from 'react';
import {View, ScrollView} from 'react-native';
import {LocalizationContext} from '../../context/LocalizationContext';
import ListeItemCheck from '../../components/lists/ListeItemCheck';
import styles from '../../styles/styles';
import {FontDimension, getFontSize} from '../../constants/theme/Fonts';
import {FontsizeOption} from '../../interfaces/Interfaces';
import {getStorageFontsize, setStorageFontsize} from '../../utils/storage';
import {ThemeContext} from '../../context/ThemeContext';
import {updateFirebaseSettings} from '../../utils/firebase';
import {AuthContext} from '../../context/AuthContext';

export default function SelectThemePage() {
  const {translations} = React.useContext(LocalizationContext);
  const {setFontsize, fontsize} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);

  const defaultFontSizeOptions: FontsizeOption[] = [
    {value: FontDimension.BIGGER, title: translations.FONT_BIGGER},
    {value: FontDimension.BIG, title: translations.FONT_BIG},
    {value: FontDimension.MEDIUM, title: translations.DEFAULT},
    {value: FontDimension.SMALL, title: translations.FONT_SMALL},
    {value: FontDimension.SMALLER, title: translations.FONT_SMALLER},
  ];

  React.useEffect(() => {
    (async () => {
      setFontsize(await getStorageFontsize());
    })();
  }, []);

  const onChangeCardtheme = async (index: number) => {
    setFontsize(defaultFontSizeOptions[index].value);
    await setStorageFontsize(defaultFontSizeOptions[index].value);
    if (user) {
      await updateFirebaseSettings(user);
    }
  };

  return (
    <ScrollView style={styles.DefaultContainer}>
      {defaultFontSizeOptions.map((theme: FontsizeOption, index) => (
        <View key={index}>
          <ListeItemCheck
            selected={theme.value == fontsize}
            text={theme.title}
            onPress={() => onChangeCardtheme(index)}
            fontSize={getFontSize(fontsize, 'fontSmallMed')}
          />
        </View>
      ))}
    </ScrollView>
  );
}
