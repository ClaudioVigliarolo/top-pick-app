import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import {updateTopics} from './api';
import {Lang, TopicLevel, TopicType} from '../interfaces/Interfaces';

export const isConnected = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ? true : false;
};

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getHash = (str1: string, str2: string = '') => {
  const str = str1 + '*' + str2;
  var hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 8) - hash + chr;
    hash |= 0;
  }
  return hash;
};

export const onTopicsUpdate = async (
  id: string,
  lang: Lang,
  setLoading: (val: boolean) => void,
  setSuccess: (val: boolean) => void,
) => {
  if (await isConnected()) {
    setLoading(true);
    const hasUpdated = await updateTopics(id, lang);
    console.log('finished update');
    setLoading(false);
    setSuccess(hasUpdated);
  }
};

export const getDifferentLang = (lang: Lang, langs: string[]): Lang => {
  const diffLang = langs.find((l) => l != lang);
  return diffLang ? (diffLang as Lang) : lang;
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

export const getDeviceId = async (): Promise<string> => {
  try {
    const deviceToken = await DeviceInfo.getDeviceId();
    return deviceToken;
  } catch (error) {
    return uuid();
  }
};

export const isValidDate = (date: string) => !isNaN(new Date(date).getDate());
