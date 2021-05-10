import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import {updateTopics} from './api';
import {Lang} from '../interfaces/Interfaces';
import AsyncStorage from '@react-native-community/async-storage';
import keys from '../../database/keys/keys';

const NO_DATE = 'Sun May 11,2014';
const NO_LANGUAGE = 'en';

export const isConnected = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ? true : false;
};

export const getHash = (str1: string, str2: string = '') => {
  const str = str1 + '*' + str2;
  var hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

export const getUserID = () => {
  try {
    const deviceID = DeviceInfo.getUniqueId();
    if (!deviceID) throw new Error('device id cannot be null');
    return getHash(deviceID);
  } catch (error) {
    // Handle errors here
    return -1;
  }
};

export const onTopicsUpdate = async (
  lang: Lang,
  setLoading: (val: boolean) => void,
  setSuccess: (val: boolean) => void,
) => {
  if (await isConnected()) {
    setLoading(true);
    const hasUpdated = await updateTopics(lang);
    console.log('finished update');
    setLoading(false);
    setSuccess(hasUpdated);
  }
};

export const getDifferentLang = (lang: Lang, langs: string[]): Lang => {
  const diffLang = langs.find((l) => l != lang);
  return diffLang ? (diffLang as Lang) : lang;
};

export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const hasLaunched = await AsyncStorage.getItem(keys.HAS_LAUNCHED);
    if (hasLaunched === null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setFirstLaunch = async () => {
  try {
    AsyncStorage.setItem(keys.HAS_LAUNCHED, 'true');
  } catch (error) {
    console.log(error);
  }
};

export const setFirstUpdate = async () => {
  try {
    AsyncStorage.setItem(keys.FIRST_UPDATED, 'true');
  } catch (error) {
    console.log(error);
  }
};

export const isFirstUpdate = async (): Promise<boolean> => {
  try {
    const hasLaunched = await AsyncStorage.getItem(keys.FIRST_UPDATED);
    if (hasLaunched === null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setStorageIsUpdated = async (val: boolean) => {
  try {
    AsyncStorage.setItem(keys.IS_UPDATED, val.toString());
  } catch (error) {
    console.log(error);
  }
};

export const isStorageUpdated = async (): Promise<boolean> => {
  try {
    const isUpdated = await AsyncStorage.getItem(keys.IS_UPDATED);
    if (isUpdated === 'true') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

//check if the language has been used at some point in the past, if no => it means the user has to download the topics from the server
export const isUsedLanguage = async (lang: string): Promise<boolean> => {
  try {
    const usedLanguages = await AsyncStorage.getItem(keys.USED_LANGUAGES);
    if (usedLanguages !== null) {
      const usedLanguagesArr: string[] = JSON.parse(usedLanguages);
      if (usedLanguagesArr.includes(lang)) {
        //the language hash already been used, return true, proceed
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setUsedLanguage = async (lang: string): Promise<void> => {
  try {
    let usedLanguagesArr: string[] = [];
    const usedLanguages = await AsyncStorage.getItem(keys.USED_LANGUAGES);
    if (usedLanguages !== null) {
      usedLanguagesArr = JSON.parse(usedLanguages);
      if (!usedLanguagesArr.includes(lang)) {
        //the language hash already been used, return true, proceed
        usedLanguagesArr.push(lang);
      }
    } else {
      //create array with first element
      usedLanguagesArr.push(lang);
    }

    await AsyncStorage.setItem(
      keys.USED_LANGUAGES,
      JSON.stringify(usedLanguagesArr),
    );
  } catch (error) {
    // Error saving data
  }
};

export const isAutomaticUpdate = async (): Promise<boolean> => {
  try {
    const isAutomaticUpdate = await AsyncStorage.getItem(keys.SETTINGS_UPDATE);
    console.log('my new isAutomaticUpdate', isAutomaticUpdate);
    return isAutomaticUpdate == 'true' ? true : false;
  } catch (error) {
    // Handle errors here
    return false;
  }
};

export function hashCode(str: string): number {
  const id = str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0,
    );
  console.log('my id' + id);
  return id;
}

export const readTheme = async (): Promise<string> => {
  try {
    const theme = await AsyncStorage.getItem(keys.THEME_KEY);
    if (theme === null || theme == 'light') {
      return 'light';
    } else {
      return 'dark';
    }
  } catch (e) {
    console.log('Failed to fetch the data from storage');
    return 'light';
  }
};

export const getLastUpdate = async (lang: Lang): Promise<string> => {
  try {
    const date = await AsyncStorage.getItem(keys.LAST_UPDATE_KEY + lang);
    if (date === null) {
      return NO_DATE;
    } else {
      return date;
    }
  } catch (e) {
    console.log('Failed to fetch date from storage');
    return NO_DATE;
  }
};

const isValidDate = (date: string) => !isNaN(new Date(date).getDate());

export const setLastUpdate = async (
  serverUpdateDate: string,
  lang: Lang,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      keys.LAST_UPDATE_KEY + lang,
      isValidDate(serverUpdateDate) ? serverUpdateDate : Date(),
    );
  } catch (e) {
    console.log('Failed to fetch date from storage');
  }
};

export const setAppContentUpdated = async (val: boolean): Promise<void> => {
  AsyncStorage.setItem(keys.LANGUAGE_KEY, JSON.stringify(val));
};
export const getStoredLanguage = async (): Promise<string> => {
  try {
    const currentLanguage = await AsyncStorage.getItem(keys.LANGUAGE_KEY);
    if (currentLanguage === null) {
      return NO_LANGUAGE;
    } else {
      return currentLanguage;
    }
  } catch (e) {
    console.log('Failed to fetch date from storage');
    return NO_LANGUAGE;
  }
};
