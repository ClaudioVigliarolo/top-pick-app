import React from 'react';
import {ThemeContext} from '../../context/ThemeContext';
import {View} from 'react-native';
import {LocalizationContext} from '../../context/LocalizationContext';
import ListeItemCheck from '../../components/lists/ListeItemCheck';
import {StatusContext} from '../../context/StatusContext';
import {defaultLanguages} from '../../context/translations';
import {
  isUsedLanguage,
  onTopicsUpdate,
  setUsedLanguage,
} from '../../utils/utils';
import StatusModal from '../../components/modals/StatusModal';
import {Lang} from '../../interfaces/Interfaces';
import styles from '../../styles/styles';

export default function SelectLanguagePage() {
  const {translations, appLanguage, setAppLanguage} = React.useContext(
    LocalizationContext,
  );
  const [selectedLanguage, setSelectedLanguage] = React.useState<Lang>(
    Lang.english,
  );
  const {theme} = React.useContext(ThemeContext);
  const {setLoadingContent, onCheckContentUpdates} = React.useContext(
    StatusContext,
  );
  const [isModalShown, setShowModal] = React.useState<boolean>(false);

  const onValChange = async (index: number): Promise<void> => {
    if (!(await isUsedLanguage(defaultLanguages[index]['value']))) {
      setSelectedLanguage(defaultLanguages[index]['value'] as Lang);
      setShowModal(true);
    } else {
      setAppLanguage(defaultLanguages[index]['value']);
      onCheckContentUpdates();
    }
  };
  {
    console.log('curent lang', translations.LANG);
  }

  const onLangDownloadCallback = (
    success: boolean,
    newLang: Lang,
    setShowModal: (val: boolean) => void,
  ) => {
    if (success) {
      setAppLanguage(newLang);
      setUsedLanguage(newLang);
      onCheckContentUpdates();
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  return (
    <View style={styles.DefaultContainer}>
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
            title={translations.DOWNALOD_LANGUAGE}
            closeOnTouchOutside={false}
            showConfirmButton={true}
            showCancelButton={true}
            confirmText={translations.DOWNLOAD}
            cancelText={translations.CANCEL}
            onConfirmPressed={() => {
              setShowModal(false);
              onTopicsUpdate(selectedLanguage, setLoadingContent, (success) =>
                onLangDownloadCallback(success, selectedLanguage, setShowModal),
              );
            }}
            onCancelPressed={() => {
              setShowModal(false);
            }}
            message={translations.DOWNALOD_LANGUAGE_REQUIRED_MESSAGE}
          />
        </View>
      ))}
    </View>
  );
}
