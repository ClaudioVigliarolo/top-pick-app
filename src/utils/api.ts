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
  getLastUpdate,
  getocalUserLastModified,
  setLastUpdate,
  setLocalUserLastModified,
} from './storage';

export const updateClient = async (key: number): Promise<boolean> => {
  console.log('IN CLIENT UPDATE');
  let hasUpdated = false;
  try {
    const response = await axios.get(`${HOSTNAME}/client/sync/get/${key}`);
    if (!response || !response.data) {
      throw new Error('got null response');
    }
    if (response.status !== 200) {
      throw new Error('got update server error');
    }
    const data: UserSyncedData = response.data;
    //set the app as updated
    const generated = await populateDBClient(data);
    console.log('HAS GENERATE', generated);
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
  id: string,
  lang: Lang,
): Promise<boolean> => {
  console.log('API PARAM', id);
  let hasUpdated = false;
  try {
    const response = await axios.get(`${HOSTNAME}/updates/get/${id}/${lang}`);
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
  lang: Lang,
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

export const syncToServer = async (key: number): Promise<boolean> => {
  try {
    const questions = await getUserQuestions();
    const topics = await getUserTopics();
    const response = await axios.post(`${HOSTNAME}/client/sync`, {
      key,
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

export const checkUpdates = async (lang: Lang): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${HOSTNAME}/updates/check/${await getLastUpdate(lang)}/${lang}`,
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
  key: number,
): Promise<{
  already_synced: boolean;
  needs_upload: boolean;
  needs_download: boolean;
} | null> => {
  try {
    const response = await axios.get(
      `${HOSTNAME}/client/sync/check/${key}/${await getocalUserLastModified()}`,
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
  client_id: string,
  key: number,
): Promise<boolean> => {
  try {
    const response = await axios.post(`${HOSTNAME}/client/create`, {
      client_id,
      key,
    });
    return response.status === 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};
