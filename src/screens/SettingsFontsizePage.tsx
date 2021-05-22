import React from 'react';
import {View} from 'react-native';
import {LocalizationContext} from '../context/LocalizationContext';
import ListeItemCheck from '../components/lists/ListeItemCheck';
import styles from '../styles/styles';
import {FontDimension} from '../constants/theme/Fonts';
import {FontsizeOption} from '../interfaces/Interfaces';
import {readStorageFontsize, setStorageFontsize} from '../utils/utils';
import {ThemeContext} from '../context/ThemeContext';

export default function SelectThemePage() {
  const {translations} = React.useContext(LocalizationContext);
  const {setFontsize, fontsize} = React.useContext(ThemeContext);
  const defaultFontSizeOptions: FontsizeOption[] = [
    {value: FontDimension.BIGGER, title: translations.FONT_BIGGER},
    {value: FontDimension.BIG, title: translations.FONT_BIG},
    {value: FontDimension.MEDIUM, title: translations.DEFAULT},
    {value: FontDimension.SMALL, title: translations.FONT_SMALL},
    {value: FontDimension.SMALLER, title: translations.FONT_SMALLER},
  ];

  React.useEffect(() => {
    (async () => {
      setFontsize(await readStorageFontsize());
    })();
  }, []);

  const onChangeCardtheme = async (index: number) => {
    setFontsize(defaultFontSizeOptions[index].value);
    await setStorageFontsize(defaultFontSizeOptions[index].value);
  };

  return (
    <View style={styles.DefaultContainer}>
      {defaultFontSizeOptions.map((theme: FontsizeOption, index) => (
        <View key={index}>
          <ListeItemCheck
            selected={theme.value == fontsize}
            text={theme.title}
            onPress={() => onChangeCardtheme(index)}
          />
        </View>
      ))}
    </View>
  );
}
