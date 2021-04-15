import React from 'react';
import {Alert} from 'react-native';
import StatusModal from '../components/modals/StatusModal';
import {checkUpdates, updateTopics} from '../utils/api';
import {
  getLastUpdate,
  isAutomaticUpdate,
  isConnected,
  isFirstUpdate,
  onTopicsUpdate,
  setFirstUpdate,
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
});

export const StatusProvider = ({children}: {children: any}) => {
  const [isLoadingContent, setLoadingContent] = React.useState<boolean>(false);
  const [isUpdatedContent, setUpdatedContent] = React.useState<boolean>(false);
  const [isRequiredUpdate, setRequiredUpdate] = React.useState<boolean>(false);
  const [isCheckingUpdates, setCheckUpdates] = React.useState<boolean>(true);

  const {translations, setAppLanguage, appLanguage} = React.useContext(
    LocalizationContext,
  );

  React.useEffect(() => {
    (async () => {
      if (await isFirstUpdate()) handleFirstUpdate();
      return () => {};
    })();

    (async () => {
      //check if first time
      //if it is the first time try loading the data
      //if it fails fai apparire un bottone speciale retry
      if (await isConnected()) {
        const isUpdated = await checkUpdates(
          await getLastUpdate(),
          translations.LANG,
        );
        setUpdatedContent(isUpdated);

        if ((await isAutomaticUpdate()) && !isUpdated) {
          setLoadingContent(true);
          const hasUpdated = await updateTopics(
            await getLastUpdate(),
            translations.LANG,
          );
          setLoadingContent(false);
          setUpdatedContent(hasUpdated);
        }
      }
      setCheckUpdates(false);
    })();
  }, []);

  const handleFirstUpdate = async () => {
    setLoadingContent(true);
    const hasFirstUpdated = await updateTopics(
      await getLastUpdate(),
      translations.LANG,
    );
    setLoadingContent(false);
    setUpdatedContent(hasFirstUpdated);

    if (hasFirstUpdated) {
      const currLang = translations.LANG;
      setAppLanguage('');
      setAppLanguage(currLang);
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

  //update app

  return (
    <StatusContext.Provider
      value={{
        isLoadingContent,
        isUpdatedContent,
        isCheckingUpdates,
        isRequiredUpdate,
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
