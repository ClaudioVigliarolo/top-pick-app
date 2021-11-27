import React from 'react';
import {View, ScrollView} from 'react-native';
import {LocalizationContext} from '../../../../context/LocalizationContext';
import ListeItemCheck from '../../../../components/lists/ListeItemCheck';
import {appLanguages} from '../../../../context/translations';
import styles from '../../../../styles/styles';

export default function SelectAppLanguagePage() {
  const {appLanguage, setAppLanguage} = React.useContext(LocalizationContext);

  return (
    <ScrollView style={styles.DefaultContainer}>
      {appLanguages.map((language, index) => (
        <View key={index}>
          <ListeItemCheck
            selected={language.value == appLanguage}
            text={language.label}
            onPress={() => setAppLanguage(language.value)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
