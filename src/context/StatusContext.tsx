import React from 'react';
import StatusModal from '../components/modals/StatusModal';
import {Lang} from '../interfaces/Interfaces';
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
  isLoadingContent: false,
  isUpdatedContent: false,
  isCheckingUpdates: true,
  isRequiredUpdate: false,
  setLoadingContent: (value: boolean) => {},
  setUpdatedContent: (value: boolean) => {},
  setRequiredUpdate: (value: boolean) => {},
  onCheckUpdates: () => {},
});

export const StatusProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoadingContent, setLoadingContent] = React.useState<boolean>(false);
  const [isUpdatedContent, setUpdatedContent] = React.useState<boolean>(false);
  const [isRequiredUpdate, setRequiredUpdate] = React.useState<boolean>(false);
  const [isCheckingUpdates, setCheckUpdates] = React.useState<boolean>(true);

  const {translations, setAppLanguage} = React.useContext(LocalizationContext);

  React.useEffect(() => {
    (async () => {
      if (await isFirstUpdate()) handleFirstUpdate();
      return () => {};
    })();

    (async () => {
      await onCheckUpdates();
    })();
  }, []);

  const onCheckUpdates = async () => {
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
      setUpdatedContent(await isStorageUpdated());
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
      }, 300);
      setRequiredUpdate(false);
      setFirstUpdate();
    } else {
      setRequiredUpdate(true);
    }
  };
  const onSetLoadingContent = (newVal: boolean) => {
    setLoadingContent(newVal);
  };

  const onSetUpdatedContent = (newVal: boolean) => {
    setUpdatedContent(newVal);
  };

  const onSetRequiredUpdate = (newVal: boolean) => {
    setRequiredUpdate(newVal);
  };

  return (
    <StatusContext.Provider
      value={{
        isLoadingContent,
        isUpdatedContent,
        isCheckingUpdates,
        isRequiredUpdate,
        onCheckUpdates,
        setLoadingContent: onSetLoadingContent,
        setUpdatedContent: onSetUpdatedContent,
        setRequiredUpdate: onSetRequiredUpdate,
      }}>
      {children}
      <StatusModal
        show={isLoadingContent}
        showProgress={true}
        title={translations.UPDATING_QUESTIONS}
        closeOnTouchOutside={false}
        showCancelButton={false}
        message={translations.WAIT_UPDATE}
      />

      <StatusModal
        show={isRequiredUpdate}
        showProgress={false}
        title={translations.UPDATE_REQUIRED_TITLE}
        closeOnTouchOutside={false}
        showConfirmButton={true}
        confirmText={translations.DOWNLOAD}
        onConfirmPressed={() => {
          setRequiredUpdate(false);
          handleFirstUpdate();
        }}
        message={translations.UPDATE_REQUIRED_MESSAGE}
      />
    </StatusContext.Provider>
  );
};
