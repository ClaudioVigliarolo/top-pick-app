import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import {updateTopics} from './api';
import {
  HelpScreen,
  Lang,
  Topic,
  TopicLevel,
  TopicType,
} from '../interfaces/Interfaces';
import AsyncStorage from '@react-native-community/async-storage';
import keys from '../../database/keys/keys';
import {FontDimension} from '../constants/theme/Fonts';
import {CardTemplates} from '../constants/theme/Cardtheme';
import {Theme} from '../constants/theme/Themes';
import {NO_DATE} from '../constants/app/App';

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
  userId: string,
  lang: Lang,
  setLoading: (val: boolean) => void,
  setSuccess: (val: boolean) => void,
) => {
  if (await isConnected()) {
    setLoading(true);
    const hasUpdated = await updateTopics(userId, lang);
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

export const setStorageTheme = async (theme: Theme): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.THEME_KEY, theme);
  } catch (error) {
    // Error saving data
  }
};

export const setStorageLanguage = async (language: Lang): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.LANGUAGE_KEY, language);
  } catch (error) {
    // Error saving data
  }
};

export const readStorageLanguage = async (): Promise<Lang | null> => {
  try {
    const retrievedLanguage = await AsyncStorage.getItem(keys.LANGUAGE_KEY);
    if (retrievedLanguage === null) {
      return null;
    } else {
      return retrievedLanguage as Lang;
    }
  } catch (e) {
    return null;
  }
};

export const setStorageFontsize = async (
  fontsize: FontDimension,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.FONTSIZE, fontsize);
  } catch (error) {
    // Error saving data
  }
};

export const readStorageFontsize = async (): Promise<FontDimension> => {
  try {
    const retrievedFontsize = await AsyncStorage.getItem(keys.FONTSIZE);
    if (retrievedFontsize === null) {
      return FontDimension.MEDIUM;
    } else {
      return retrievedFontsize as FontDimension;
    }
  } catch (e) {
    return FontDimension.MEDIUM;
  }
};

export const saveStorageRecent = async (
  recentsArray: Topic[],
  language: Lang,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      keys.RECENT_SEARCH_KEY + language,
      JSON.stringify(recentsArray),
    );
  } catch (error) {}

  try {
    await AsyncStorage.setItem(keys.LANGUAGE_KEY, language);
  } catch (error) {
    // Error saving data
  }
};

export const clearStorage = async (): Promise<void> => {
  AsyncStorage.clear();
};

export const readStorageRecents = async (
  language: Lang,
): Promise<string | null> => {
  try {
    const retrievedRecents = await AsyncStorage.getItem(
      keys.RECENT_SEARCH_KEY + language,
    );
    return retrievedRecents;
  } catch (e) {
    return null;
  }
};

export const saveStorageUpdateSettings = async (
  val: boolean,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.SETTINGS_UPDATE, val.toString());
  } catch (error) {}
};

export const saveStoragCardtheme = async (theme: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.CARDS_THEME, theme);
  } catch (error) {}
};

export const saveTopicsTableNumber = async (
  n: number,
  lang: Lang,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.TOPICS_NUMBER + lang, n.toString());
  } catch (error) {}
};

export const getTopicsTableNumber = async (lang: Lang): Promise<number> => {
  try {
    const n = await AsyncStorage.getItem(keys.TOPICS_NUMBER + lang);
    if (n === null) {
      return 100;
    } else {
      return parseInt(n);
    }
  } catch (e) {
    console.log('Failed to fetch the data from storage');
    return 100;
  }
};

export const readStorageCardtheme = async (): Promise<keyof CardTemplates> => {
  try {
    const cardTheme = await AsyncStorage.getItem(keys.CARDS_THEME);
    if (cardTheme === null) {
      return 'default';
    } else {
      return cardTheme as keyof CardTemplates;
    }
  } catch (e) {
    console.log('Failed to fetch the data from storage');
    return 'default';
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

export const isFirstHelp = async (screen: HelpScreen): Promise<boolean> => {
  try {
    const isFirstHelp = await AsyncStorage.getItem(keys.FIRST_HELP + screen);
    console.log('my new isFirstHelp', isFirstHelp);
    return isFirstHelp === 'false' ? false : true;
  } catch (error) {
    // Handle errors here
    return false;
  }
};

export const setLocalUserLastModified = async (time: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.USER_LAST_TIMESTAMP, time);
  } catch (error) {
    // Error saving data
  }
};

export const getocalUserLastModified = async (): Promise<string> => {
  try {
    const retrievedTimestamp = await AsyncStorage.getItem(
      keys.USER_LAST_TIMESTAMP,
    );
    if (retrievedTimestamp === null) {
      return NO_DATE;
    } else {
      return retrievedTimestamp;
    }
  } catch (e) {
    return NO_DATE;
  }
};

export const setFirstHelp = async (screen: HelpScreen): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.FIRST_HELP + screen, 'false');
  } catch (error) {}
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

export const readTheme = async (): Promise<Theme> => {
  try {
    const theme = await AsyncStorage.getItem(keys.THEME_KEY);
    if (theme === null || theme == Theme.LIGHT) {
      return Theme.LIGHT;
    } else {
      return Theme.DARK;
    }
  } catch (e) {
    console.log('Failed to fetch the data from storage');
    return Theme.LIGHT;
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

export const getTopicLevelLabel = (level: TopicLevel | undefined): string => {
  switch (level) {
    case TopicLevel.EASY:
      return 'Easy';
    case TopicLevel.MEDIUM:
      return 'Medium';
    case TopicLevel.HARD:
      return 'Hard';
    default:
      return '';
  }
};

export const getTopicTypeLabel = (level: TopicType): string => {
  switch (level) {
    case TopicType.TOPIC:
      return 'Topic';
    case TopicType.DIALOG:
      return 'Dialog';
    default:
      return '';
  }
};

export const getTopicLevelColor = (level: TopicLevel | undefined): string => {
  switch (level) {
    case TopicLevel.EASY:
      return 'green';
    case TopicLevel.MEDIUM:
      return 'orange';
    case TopicLevel.HARD:
      return 'orangered';
    default:
      return 'black';
  }
};
