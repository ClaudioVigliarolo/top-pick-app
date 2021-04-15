import React from 'react';
import {ThemeContext} from '../context/ThemeContext';
import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import {LocalizationContext} from '../context/LocalizationContext';
import ListeItemCheck from '../components/lists/ListeItemCheck';
import {StatusContext} from '../context/StatusContext';
import {isUsedLanguage, onTopicsUpdate} from '../utils/utils';
import StatusModal from '../components/modals/StatusModal';
interface Language {
  label: string;
  value: string;
}
const defaultLanguages: Language[] = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Italiano',
    value: 'it',
  },
];

export default function SelectLanguagePage() {
  const {translations, appLanguage, setAppLanguage} = React.useContext(
    LocalizationContext,
  );
  const {theme} = React.useContext(ThemeContext);
  const {
    isLoadingContent,
    setRequiredUpdate,
    setLoadingContent,
    setUpdatedContent,
  } = React.useContext(StatusContext);
  const [isModalShown, setShowModal] = React.useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
  });

  const onValChange = async (index: number): Promise<void> => {
    setAppLanguage(defaultLanguages[index]['value']);
    if (await isUsedLanguage(defaultLanguages[index]['value'])) {
      setShowModal(true);
    }
    setAppLanguage(defaultLanguages[index]['value']);
  };

  return (
    <View style={styles.container}>
      {defaultLanguages.map((language, index) => (
        <View key={index}>
          <ListeItemCheck
            selected={language.value == appLanguage}
            text={language.label}
            onPress={() => onValChange(index)}
          />
          <StatusModal
            show={isModalShown}
            showProgress={false}
            title={translations.UPDATE_REQUIRED_TITLE}
            closeOnTouchOutside={false}
            showConfirmButton={true}
            showCancelButton={true}
            confirmText={translations.DOWNLOAD}
            cancelText={translations.CANCEL}
            onConfirmPressed={() => {
              setShowModal(false);
              onTopicsUpdate(
                translations.LANG,
                setLoadingContent,
                setUpdatedContent,
              );
            }}
            onCancelPressed={() => {
              setShowModal(false);
            }}
            message={translations.UPDATE_REQUIRED_MESSAGE}
          />
        </View>
      ))}
    </View>
  );
}
