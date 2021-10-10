import React from 'react';
import {Linking, Platform} from 'react-native';
import VersionCheck from 'react-native-version-check';
import StatusModal from '../components/modals/StatusModal';
import {Lang} from '../interfaces/Interfaces';
import {
  checkClientSync,
  checkUpdates,
  syncToServer,
  updateClient,
  updateTopics,
} from '../utils/api';
import {
  getStorageAutomaticUpdate,
  isFirstUpdate,
  setFirstUpdate,
  setStorageIsUpdated,
  setUsedLanguage,
} from '../utils/storage';
import {AuthContext} from './AuthContext';
import {LocalizationContext} from './LocalizationContext';
import * as RootNavigation from '../navigation/RootNavigation';
import {getDeviceToken, getDifferentLang, isConnected} from '../utils/utils';

/*
    this context is used to notify the app about his state 
    it can be either up to date with the server, loading or not up to date
*/

export const StatusContext = React.createContext({
  isLoadingContentUpdates: false,
  isContentUpdated: false,
  isCheckingContentUpdates: false,
  isSyncUserContentLoading: false,
  isSyncUserContentError: false,
  isSyncUserContent: false,
  isRequiredAuthFunctionality: false,
  setLoadingContent: (value: boolean) => {},
  setUpdatedContent: (value: boolean) => {},
  setSyncUserContentLoading: (value: boolean) => {},
  setSyncUserContentError: (value: boolean) => {},
  setSyncUserContent: (value: boolean) => {},
  setRequiredAuthFunctionality: (value: boolean) => {},
  onCheckContentUpdates: () => {},
});

export const StatusProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoadingContentUpdates, setLoadingContent] = React.useState<boolean>(
    false,
  );
  const [isRequiredAppUpdate, setRequiredAppUpdate] = React.useState<boolean>(
    false,
  );
  const [
    isSyncUserContentLoading,
    setSyncUserContentLoading,
  ] = React.useState<boolean>(false);
  const [
    isSyncUserContentError,
    setSyncUserContentError,
  ] = React.useState<boolean>(false);
  const [isSyncUserContent, setSyncUserContent] = React.useState<boolean>(
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
  const [
    isRequiredAuthFunctionality,
    setRequiredAuthFunctionality,
  ] = React.useState<boolean>(false);

  const {translations, setAppLanguage} = React.useContext(LocalizationContext);
  const {user, DBAuthKey} = React.useContext(AuthContext);

  React.useEffect(() => {
    (async () => {
      if (await isFirstUpdate()) handleFirstUpdate();
      //check app is updated
      if (!(await onCheckAppUpdates())) {
        //check content
        await onCheckContentUpdates();
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      //check user data
      if (DBAuthKey) await onSyncUserData();
    })();
  }, [DBAuthKey]);

  const fetchUserSync = async () => {
    if (DBAuthKey) {
      setSyncUserContentLoading(true);
      if (await updateClient(DBAuthKey)) {
        setSyncUserContent(true);
      } else {
        //display error
        setSyncUserContentError(true);
      }
      setSyncUserContentLoading(false);
    }
  };

  const goSignIn = () => {
    RootNavigation.navigate('Login', {
      screen: 'LoginScreen',
    });
    setRequiredAuthFunctionality(false);
  };

  const onSyncUserData = async () => {
    //check if there app in store is up to date
    //if not set update required
    if (DBAuthKey) {
      setSyncUserContentLoading(true);
      const syncedResponse = await checkClientSync(DBAuthKey);
      console.log('synced respo', syncedResponse);
      if (syncedResponse) {
        if (syncedResponse.already_synced) {
          setSyncUserContent(true);
        } else if (syncedResponse.needs_upload) {
          //upload the current content to server
          await syncToServer(DBAuthKey);
          setSyncUserContent(false);
        } else {
          //load content from server
          console.log('NEEEDS DOWNLOAD');
          await fetchUserSync();
        }
      }
      setSyncUserContentLoading(false);
    }
  };

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

      if ((await getStorageAutomaticUpdate()) && !isUpdated) {
        setLoadingContent(true);
        const hasUpdated = await updateTopics(
          user ? user.uid : await getDeviceToken(),
          translations.LANG as Lang,
        );
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
    await setUsedLanguage(translations.LANG as Lang);
    const hasFirstUpdated = await updateTopics(
      user ? user.uid : await getDeviceToken(),
      translations.LANG as Lang,
    );
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

  const onsetSyncUserContentLoading = (newVal: boolean) => {
    setSyncUserContentLoading(newVal);
  };

  const onsetSyncUserContentError = (newVal: boolean) => {
    setSyncUserContentError(newVal);
  };

  const onsetSyncUserContent = (newVal: boolean) => {
    setSyncUserContent(newVal);
  };

  const onsetRequiredAuthFunctionality = (newVal: boolean) => {
    setTimeout(() => {
      setRequiredAuthFunctionality(newVal);
    }, 500);
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
        isSyncUserContentLoading,
        isSyncUserContentError,
        isSyncUserContent,
        isRequiredAuthFunctionality,
        setLoadingContent: onSetLoadingContent,
        setUpdatedContent: onSetUpdatedContent,
        setSyncUserContentLoading: onsetSyncUserContentLoading,
        setSyncUserContentError: onsetSyncUserContentError,
        setSyncUserContent: onsetSyncUserContent,
        setRequiredAuthFunctionality: onsetRequiredAuthFunctionality,
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
        show={isSyncUserContentError}
        title={'Sync required'}
        closeOnTouchOutside={false}
        showConfirmButton={true}
        showCancelButton={false}
        confirmText="retry"
        onConfirmPressed={fetchUserSync}
        message={
          "Couldn't fetch data from the server, you need to sync the data of your account"
        }
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

      <StatusModal
        show={isRequiredAuthFunctionality}
        title={'Sign in Required'}
        onCancelPressed={() => {
          setRequiredAuthFunctionality(false);
        }}
        closeOnTouchOutside={false}
        showConfirmButton={true}
        showCancelButton={true}
        cancelText={'Close'}
        confirmText="Sign in"
        onConfirmPressed={goSignIn}
        message={'Sign in to unlock this functionality'}
      />
    </StatusContext.Provider>
  );
};
