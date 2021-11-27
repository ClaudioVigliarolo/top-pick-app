import React from 'react';
import {View, ScrollView} from 'react-native';
import {LocalizationContext} from '../../../context/LocalizationContext';
import ListeItemCheck from '../../../components/lists/ListeItemCheck';
import {StatusContext} from '../../../context/StatusContext';
import translations, {contentLanguages} from '../../../context/translations';
import {isUsedLanguage, setUsedLanguage} from '../../../utils/storage/storage';
import StatusModal from '../../../components/modals/StatusModal';
import {Lang} from '../../../interfaces/Interfaces';
import styles from '../../../styles/styles';
import {AuthContext} from '../../../context/AuthContext';
import {getDeviceId, onTopicsUpdate} from '../../../utils/utils/utils';

export default function SettingsContentLanguagePage() {
  const {setContentLanguage, contentLanguage} = React.useContext(
    LocalizationContext,
  );
  const [selectedLanguage, setSelectedLanguage] = React.useState<Lang>(
    Lang.english,
  );
  const {setLoadingContent, onCheckContentUpdates} = React.useContext(
    StatusContext,
  );

  const {user} = React.useContext(AuthContext);
  const [isModalShown, setShowModal] = React.useState<boolean>(false);

  const onValChange = async (index: number): Promise<void> => {
    if (!(await isUsedLanguage(contentLanguages[index]['value']))) {
      setSelectedLanguage(contentLanguages[index]['value'] as Lang);
      setShowModal(true);
    } else {
      setContentLanguage(contentLanguages[index]['value']);
      onCheckContentUpdates();
    }
  };

  const onLangDownloadCallback = (
    success: boolean,
    newLang: Lang,
    setShowModal: (val: boolean) => void,
  ) => {
    if (success) {
      setContentLanguage(newLang);
      setUsedLanguage(newLang);
      onCheckContentUpdates();
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  return (
    <ScrollView style={styles.DefaultContainer}>
      {contentLanguages.map((language, index) => (
        <View key={index}>
          <ListeItemCheck
            selected={language.value == contentLanguage}
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
            onConfirmPressed={async () => {
              setShowModal(false);
              onTopicsUpdate(
                user ? user.uid : await getDeviceId(),
                selectedLanguage,
                setLoadingContent,
                (success) =>
                  onLangDownloadCallback(
                    success,
                    selectedLanguage,
                    setShowModal,
                  ),
              );
            }}
            onCancelPressed={() => {
              setShowModal(false);
            }}
            message={translations.DOWNALOD_LANGUAGE_REQUIRED_MESSAGE}
          />
        </View>
      ))}
    </ScrollView>
  );
}
