import {Platform} from 'react-native';
import {CopilotOptions} from 'react-native-copilot';

export const MAX_RECENTS = 3;
export const MAX_POPULAR = 6;
export const INITIALS_TOPICS_LOADED = 10;
export const NEW_TOPICS_LOADED = 10;
export const CHUNK_RECENT_TOPIC = 10;
export const RECENT_LOADED_N = 100;
export const LAZY_LOAD_TIMEOUT = 100;
export const NEW_TOPICS_MODAL_TIMEOUT = 10000;
export const USER_QUESTION_PRIORITY_N = -1;
export const MIN_DB_VERSION = 5;
export const SQL_MAX_TUPLES = 600;
export const REDIRECT_HOME = 1000;
export const NO_DATE = 'Sun May 11,2014';
export const APP_ID_ANDROID = {
  packageName: 'com.topick',
  appName: 'TopPick',
};

export const APP_ID_IOS = {
  appID: '1571806777',
  appName: 'TopPick',
};

export const COPILOT_OPTIONS: CopilotOptions = {
  animated: true, // Can be true or false
  verticalOffset: Platform.OS === 'ios' ? 0 : 30, // <= this worked
  overlay: 'svg', // Can be either view or svg
};
