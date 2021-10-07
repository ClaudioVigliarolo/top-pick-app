import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import axios from 'axios';
import {HOSTNAME} from '../config/config';
import {
  JSONresponse,
  Lang,
  Report,
  UserSyncedData,
} from '../interfaces/Interfaces';
import {
  populateDBTopics,
  getUserQuestions,
  getUserTopics,
  populateDBClient,
} from './sql';
import {
  getHash,
  getLastUpdate,
  getocalUserLastModified,
  setLastUpdate,
  setLocalUserLastModified,
} from './utils';

export const updateClient = async (userId: string): Promise<boolean> => {
  console.log('IN CLIENT UPDATE');
  let hasUpdated = false;
  try {
    const response = await axios.get(
      `${HOSTNAME}/client/sync/get/${getHash(userId)}`,
    );
    if (!response || !response.data) {
      throw new Error('got null response');
    }
    if (response.status !== 200) {
      throw new Error('got update server error');
    }
    const data: UserSyncedData = response.data;
    //set the app as updated
    const generated = await populateDBClient(data);
    if (generated) {
      hasUpdated = true;
      await setLocalUserLastModified(data.last_sync);
    } else {
      hasUpdated = false;
    }
    return hasUpdated;
  } catch (err) {
    console.log('Cannot retrieve ' + err);
    return false;
  }
};

export const updateTopics = async (
  userId: string,
  lang: Lang,
): Promise<boolean> => {
  let hasUpdated = false;
  try {
    const response = await axios.get(
      `${HOSTNAME}/updates/get/${getHash(userId)}/${lang}`,
    );
    if (!response || !response.data) {
      throw new Error('got null response');
    }
    if (response.status !== 200) {
      throw new Error('got update server error');
    }
    const data: JSONresponse = response.data;
    //set the app as updated
    const generated = await populateDBTopics(data.updates, lang);
    if (generated) {
      hasUpdated = true;
      await setLastUpdate(data.last_update, lang);
    } else {
      hasUpdated = false;
    }
    return hasUpdated;
  } catch (err) {
    console.log('Cannot retrieve ' + err);
    return false;
  }
};

export const addReport = async (
  report: Report,
  lang: string,
): Promise<boolean> => {
  try {
    const response = await axios.post(`${HOSTNAME}/reports`, {
      report,
      lang,
    });
    return response.status === 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const syncToServer = async (userId: string): Promise<boolean> => {
  try {
    const questions = await getUserQuestions();
    const topics = await getUserTopics();
    const response = await axios.post(`${HOSTNAME}/client/sync`, {
      id: getHash(userId),
      topics,
      questions,
      last_sync: await getocalUserLastModified(),
    });
    return response.status === 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const checkUpdates = async (
  userId: string,
  lang: Lang,
): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${HOSTNAME}/updates/check/${getHash(userId)}/${await getLastUpdate(
        lang,
      )}/${lang}`,
    );
    if (!response) {
      throw new Error('got null response');
    }
    const data: {already_updated: boolean} = response.data;
    return data.already_updated;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const checkClientSync = async (
  userId: string,
): Promise<{
  already_synced: boolean;
  needs_upload: boolean;
  needs_download: boolean;
} | null> => {
  try {
    const response = await axios.get(
      `${HOSTNAME}/client/sync/check/${getHash(
        userId,
      )}/${await getocalUserLastModified()}`,
    );
    if (!response) {
      throw new Error('got null response');
    }
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

//2 condizioni: il contenuto non è più update, o sul server c'è una aggiornamento più nuovo
export const createClientDb = async (
  user: FirebaseAuthTypes.User,
): Promise<boolean> => {
  try {
    const response = await axios.post(`${HOSTNAME}/client/create`, {
      id: getHash(user.uid),
    });
    return response.status === 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};
