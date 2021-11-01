import {
  HelpScreen,
  Lang,
  Topic,
  TopicLevel,
  UserGoal,
  UserInterests,
  UserSettings,
} from '../interfaces/Interfaces';
import AsyncStorage from '@react-native-community/async-storage';
import keys from '../../database/keys/keys';
import {FontDimension} from '../constants/theme/Fonts';
import {CardTemplates} from '../constants/theme/Cardtheme';
import {Theme} from '../constants/theme/Themes';
import {NO_DATE} from '../constants/app/App';
import {isValidDate} from './utils';

export const clearStorage = async (): Promise<void> => {
  AsyncStorage.clear();
};

export const getStorageRecents = async (
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
export const isUsedLanguage = async (lang: Lang): Promise<boolean> => {
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

export const getStorageUserCategoriesId = async (): Promise<
  number[] | null
> => {
  try {
    const categoriesId = await AsyncStorage.getItem(keys.USER_CATEGORIES_ID);
    if (categoriesId !== null) {
      return JSON.parse(categoriesId);
    }
    return [];
  } catch (error) {
    return null;
  }
};

export const getStorageUserLevel = async (): Promise<TopicLevel | null> => {
  try {
    const level = await AsyncStorage.getItem(keys.USER_LEVEL);
    if (level !== null) {
      return parseInt(level);
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getUserGoals = async (): Promise<UserGoal[] | null> => {
  try {
    const goals = await AsyncStorage.getItem(keys.USER_GOALS);
    if (goals !== null) {
      return JSON.parse(goals);
    }
    return [];
  } catch (error) {
    return null;
  }
};

export const setUsedLanguage = async (lang: Lang): Promise<void> => {
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

export const getStorageLanguage = async (): Promise<Lang | null> => {
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

export const getStorageFontsize = async (): Promise<FontDimension> => {
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

export const setStorageRecent = async (
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

export const setStorageAutomaticUpdate = async (
  val: boolean,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.SETTINGS_UPDATE, val.toString());
  } catch (error) {}
};

export const setStorageUserCategoriesId = async (
  category_ref_id: number[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      keys.USER_CATEGORIES_ID,
      JSON.stringify(category_ref_id),
    );
  } catch (error) {}
};

export const setStorageUserLevel = async (level: TopicLevel): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.USER_LEVEL, JSON.stringify(level));
  } catch (error) {}
};

export const setStorageUserGoals = async (goals: UserGoal[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(keys.USER_GOALS, JSON.stringify(goals));
  } catch (error) {}
};

export const setStorageCardtheme = async (theme: string): Promise<void> => {
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

export const getStorageCardtheme = async (): Promise<keyof CardTemplates> => {
  try {
    const cardTheme = await AsyncStorage.getItem(keys.CARDS_THEME);
    console.log('MY STTOO', cardTheme);
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

export const getStorageAutomaticUpdate = async (): Promise<boolean> => {
  try {
    const getStorageAutomaticUpdate = await AsyncStorage.getItem(
      keys.SETTINGS_UPDATE,
    );
    console.log('my new getStorageAutomaticUpdate', getStorageAutomaticUpdate);
    return getStorageAutomaticUpdate == 'true' ? true : false;
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

export const getStorageTheme = async (): Promise<Theme> => {
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
export const getStoredLanguage = async (): Promise<Lang> => {
  try {
    const currentLanguage = await AsyncStorage.getItem(keys.LANGUAGE_KEY);
    if (currentLanguage === null) {
      return Lang.english;
    } else {
      return currentLanguage as Lang;
    }
  } catch (e) {
    console.log('Failed to fetch date from storage');
    return Lang.english;
  }
};

export const loadSettings = async (settings: UserSettings): Promise<void> => {
  console.log('MYSSSSS', settings);
  await setStorageCardtheme(settings.cardTheme);
  await setStorageFontsize(settings.fontSize);
  await setStorageIsUpdated(settings.isAutoUpdate);
  await setStorageLanguage(settings.language);
  await setStorageTheme(settings.darkMode);
};

export const loadInterests = async (
  interests: UserInterests,
): Promise<void> => {
  await setStorageUserGoals(interests.goals);
  await setStorageUserCategoriesId(interests.categories_ref_id);
  await setStorageUserLevel(interests.level);
};

export const getStorageInterests = async (): Promise<UserInterests> => {
  const userGoals = await getUserGoals();
  const categoriesRefId = await getStorageUserCategoriesId();
  const level = await getStorageUserLevel();
  const interests: UserInterests = {
    goals: userGoals ? userGoals : [],
    categories_ref_id: categoriesRefId ? categoriesRefId : [],
    level: level ? level : TopicLevel.IGNORE,
  };
  return interests;
};

export const getStoreSettings = async (): Promise<UserSettings> => {
  const settings: UserSettings = {
    isAutoUpdate: await getStorageAutomaticUpdate(),
    cardTheme: await getStorageCardtheme(),
    darkMode: await getStorageTheme(),
    fontSize: await getStorageFontsize(),
    language: await getStoredLanguage(),
  };
  return settings;
};
