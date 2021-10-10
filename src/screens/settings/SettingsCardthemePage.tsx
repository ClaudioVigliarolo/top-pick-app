import React from 'react';
import {View, ScrollView} from 'react-native';
import {LocalizationContext} from '../../context/LocalizationContext';
import ListeItemCheck from '../../components/lists/ListeItemCheck';
import styles from '../../styles/styles';
import {setStorageCardtheme} from '../../utils/storage';
import {ThemeContext} from '../../context/ThemeContext';
import {CardTemplates} from '../../constants/theme/Cardtheme';
import {updateFirebaseSettings} from '../../utils/firebase';
import {AuthContext} from '../../context/AuthContext';

interface Cardtheme {
  title: string;
  value: string;
}

export default function SelectThemePage() {
  const {translations} = React.useContext(LocalizationContext);
  const {cardTheme, setCardtheme} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);

  const defaultCardthemes: Cardtheme[] = [
    {value: 'default', title: translations.DEFAULT},
    {value: 'orange', title: translations.ORANGE},
    {value: 'red', title: translations.RED},
    {value: 'blue', title: translations.BLUE},
    {value: 'green', title: translations.GREEN},
    {value: 'violet', title: translations.VIOLET},
  ];

  const onChangeCardtheme = async (index: number) => {
    const newTheme = defaultCardthemes[index].value;
    await setStorageCardtheme(newTheme);
    setCardtheme(newTheme as keyof CardTemplates);
    if (user) {
      await updateFirebaseSettings(user);
    }
  };

  return (
    <ScrollView style={styles.DefaultContainer}>
      {defaultCardthemes.map((theme: Cardtheme, index) => (
        <View key={index}>
          <ListeItemCheck
            selected={theme.value == cardTheme}
            text={theme.title}
            onPress={() => onChangeCardtheme(index)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
