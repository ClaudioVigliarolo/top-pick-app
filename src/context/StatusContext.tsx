import React from 'react';
import {Linking, Platform} from 'react-native';
import VersionCheck from 'react-native-version-check';
import StatusModal from '../components/modals/StatusModal';
import {Lang, Topic} from '../interfaces/Interfaces';
import {checkUpdates, updateTopics} from '../utils/api';
import {
  getDifferentLang,
  isAutomaticUpdate,
  isConnected,
  isFirstUpdate,
  isStorageUpdated,
  setFirstUpdate,
  setStorageIsUpdated,
  setUsedLanguage,
} from '../utils/utils';
import {LocalizationContext} from './LocalizationContext';
/*
    this context is used to notify the app about his state 
    it can be either up to date with the server, loading or not up to date
*/

export const StatusContext = React.createContext({
  isLoadingContentUpdates: false,
  isContentUpdated: false,
  isCheckingContentUpdates: true,
  setLoadingContent: (value: boolean) => {},
  setUpdatedContent: (value: boolean) => {},
  onCheckContentUpdates: () => {},
});

export const StatusProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoadingContentUpdates, setLoadingContent] = React.useState<boolean>(
    false,
  );
  const [isRequiredAppUpdate, setRequiredAppUpdate] = React.useState<boolean>(
    false,
  );

  const [isContentUpdated, setUpdatedContent] = React.useState<boolean>(true);

  const [
    isRequiredContentUpdate,
    setRequiredContentUpdate,
  ] = React.useState<boolean>(false);
  const [isCheckingContentUpdates, setCheckUpdates] = React.useState<boolean>(
    true,
  );

  const {translations, setAppLanguage} = React.useContext(LocalizationContext);

  React.useEffect(() => {
    (async () => {
      if (await isFirstUpdate()) handleFirstUpdate();
      //check app is updated
      if (!(await onCheckAppUpdates())) {
        //check content
        await onCheckContentUpdates();
        //check app is used for the first time
      }
      return () => {};
    })();
  }, []);

  const onCheckAppUpdates = async () => {
    //check if there app in store is up to date
    //if not set update required
    const res = await VersionCheck.needUpdate();
    const isNeeded = res && res.isNeeded;
    setRequiredAppUpdate(isNeeded);
    return isNeeded;
  };

  const onCheckContentUpdates = async () => {
    if (await isConnected()) {
      const isUpdated = await checkUpdates(translations.LANG as Lang);
      setUpdatedContent(isUpdated);
      setStorageIsUpdated(isUpdated);

      if ((await isAutomaticUpdate()) && !isUpdated) {
        setLoadingContent(true);
        const hasUpdated = await updateTopics(translations.LANG as Lang);
        setLoadingContent(false);
        setUpdatedContent(hasUpdated);
      }
    } else {
      setUpdatedContent(true); //(await isStorageUpdated()
      //se non c'è internet => prendi il valore da update
    }
    setCheckUpdates(false);
  };

  const handleFirstUpdate = async () => {
    setLoadingContent(true);
    await setUsedLanguage(translations.LANG);
    const hasFirstUpdated = await updateTopics(translations.LANG as Lang);
    setLoadingContent(false);
    setUpdatedContent(hasFirstUpdated);

    if (hasFirstUpdated) {
      const currLang = translations.LANG as Lang;
      setAppLanguage(
        getDifferentLang(currLang, translations.getAvailableLanguages()),
      );
      //trick for reloading loaded component's questions
      setTimeout(() => {
        setAppLanguage(currLang);
      }, 250);
      setRequiredContentUpdate(false);
      setFirstUpdate();
    } else {
      setRequiredContentUpdate(true);
    }
  };
  const onSetLoadingContent = (newVal: boolean) => {
    setLoadingContent(newVal);
  };

  const onSetUpdatedContent = (newVal: boolean) => {
    setUpdatedContent(newVal);
  };

  const openStore = async () => {
    if (Platform.OS == 'ios') {
      const url = await VersionCheck.getAppStoreUrl();
      Linking.openURL(url);
    } else {
      const url = await VersionCheck.getPlayStoreUrl();
      Linking.openURL(url);
    }
  };

  return (
    <StatusContext.Provider
      value={{
        isLoadingContentUpdates,
        isContentUpdated,
        isCheckingContentUpdates,
        onCheckContentUpdates,
        setLoadingContent: onSetLoadingContent,
        setUpdatedContent: onSetUpdatedContent,
      }}>
      {children}

      <StatusModal
        show={isRequiredAppUpdate}
        title={translations.UPDATE_APP_REQUIRED_TITLE}
        closeOnTouchOutside={false}
        showConfirmButton={true}
        showCancelButton={false}
        confirmText="update app"
        onConfirmPressed={openStore}
        message={translations.UPDATE_APP_REQUIRED_MESSAGE}
      />

      <StatusModal
        show={isLoadingContentUpdates}
        showProgress={true}
        title={translations.UPDATING_QUESTIONS}
        closeOnTouchOutside={false}
        showCancelButton={false}
        message={translations.WAIT_UPDATE}
      />

      <StatusModal
        show={isRequiredContentUpdate}
        showProgress={false}
        title={translations.UPDATE_CONTENT_REQUIRED_TITLE}
        closeOnTouchOutside={false}
        showConfirmButton={true}
        confirmText={translations.DOWNLOAD}
        onConfirmPressed={() => {
          setRequiredContentUpdate(false);
          handleFirstUpdate();
        }}
        message={translations.UPDATE_CONTENT_REQUIRED_MESSAGE}
      />
    </StatusContext.Provider>
  );
};
