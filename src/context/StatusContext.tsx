import React from 'react';
import {Linking, Platform} from 'react-native';
import VersionCheck from 'react-native-version-check';
import StatusModal from '../components/modals/StatusModal';
import firestore from '@react-native-firebase/firestore';

import {
  checkClientSync,
  checkUpdates,
  syncToServer,
  updateClient,
  updateTopics,
} from '../utils/cloud/api';
import {
  getStorageAutomaticUpdate,
  isFirstUpdate,
  loadInterests,
  loadSettings,
  setFirstUpdate,
  setStorageIsUpdated,
  setUsedLanguage,
} from '../utils/storage/storage';
import {AuthContext} from './AuthContext';
import {LocalizationContext} from './LocalizationContext';
import * as RootNavigation from '../navigation/RootNavigation';
import {getDeviceId, isConnected} from '../utils/utils/utils';
import {APP_ID_ANDROID, APP_ID_IOS} from '../constants/app/App';
import translations from './translations';
import {ThemeContext} from './ThemeContext';
import {UserInterests, UserSettings} from '../interfaces/Interfaces';

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
  onContentUpdate: () => {},
  onCheckContentUpdates: () => {},
  forceRefresh: 0,
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

  const [forceRefresh, setForceRefresh] = React.useState<number>(0);

  const {
    setContentLanguage,
    contentLanguage,
    setAppLanguage,
  } = React.useContext(LocalizationContext);
  const {user, DBAuthKey, setDBAuthKey} = React.useContext(AuthContext);
  const {setCardtheme, setFontsize, setTheme} = React.useContext(ThemeContext);

  React.useEffect(() => {
    (async () => {
      if (await isFirstUpdate()) onContentUpdate();
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
      if (user) {
        await onSyncUserData();
        const userDocument = (
          await firestore().collection('Users').doc(user.uid).get()
        ).data();
        if (userDocument) {
          //set db key to sign requests
          setDBAuthKey(userDocument.DBAuthKey);
          //load settings
          await loadSettings(userDocument.settings as UserSettings);
          loadCurrentSettings(userDocument.settings as UserSettings);
          if (userDocument.interests) {
            await loadInterests(userDocument.interests as UserInterests);
          }
        }
      }
    })();
  }, [user]);

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

  const loadCurrentSettings = (settings: UserSettings) => {
    setTheme(settings.darkMode);
    setCardtheme(settings.cardTheme);
    setFontsize(settings.fontSize);
    setAppLanguage(settings.appLanguage);
    setContentLanguage(settings.contentLanguage);
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
      if (syncedResponse) {
        if (syncedResponse.already_synced) {
          setSyncUserContent(true);
        } else if (syncedResponse.needs_upload) {
          //upload the current content to server
          await syncToServer(DBAuthKey);
          setSyncUserContent(false);
        } else {
          //load content from server
          await fetchUserSync();
        }
      }
      setSyncUserContentLoading(false);
    }
  };

  const onCheckAppUpdates = async () => {
    //check if there app in store is up to date
    //if not set update required
    const res = await VersionCheck.needUpdate({
      packageName: APP_ID_ANDROID.packageName,
    });
    const isNeeded = res && res.isNeeded;
    setRequiredAppUpdate(isNeeded);
    return isNeeded;
  };

  const onCheckContentUpdates = async () => {
    if (await isConnected()) {
      const isUpdated = await checkUpdates(contentLanguage);
      setUpdatedContent(isUpdated);
      setStorageIsUpdated(isUpdated);

      if ((await getStorageAutomaticUpdate()) && !isUpdated) {
        setLoadingContent(true);
        const hasUpdated = await updateTopics(
          user ? user.uid : await getDeviceId(),
          contentLanguage,
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

  const onContentUpdate = async () => {
    console.log('UPDATE CONTENT WITH ', contentLanguage);
    setLoadingContent(true);
    await setUsedLanguage(contentLanguage);
    const hasFirstUpdated = await updateTopics(
      user ? user.uid : await getDeviceId(),
      contentLanguage,
    );
    setUpdatedContent(hasFirstUpdated);
    setLoadingContent(false);
    if (hasFirstUpdated) {
      const currLang = contentLanguage;
      setContentLanguage(currLang);
      setForceRefresh((forceRefresh) => forceRefresh + 1);
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
    let url;
    if (Platform.OS == 'ios') {
      url = await VersionCheck.getAppStoreUrl({
        appID: APP_ID_IOS.appID,
      });
    } else {
      url = await VersionCheck.getPlayStoreUrl({
        packageName: APP_ID_ANDROID.packageName,
      });
    }
    Linking.openURL(url);
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
        onContentUpdate,
        forceRefresh,
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
          onContentUpdate();
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
