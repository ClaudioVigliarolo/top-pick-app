import firestore from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {UserData, UserInterests} from '../../interfaces/Interfaces';
import {getHash, uuid} from '../utils/utils';
import {getStoreSettings} from '../storage/storage';

export const createUserData = async (user: FirebaseAuthTypes.User) => {
  const userData: UserData = {
    DBAuthKey: getHash(uuid()),
    settings: await getStoreSettings(),
  };
  await firestore().collection('Users').doc(user.uid).set(userData);
  return userData;
};

export const updateFirebaseSettings = async (user: FirebaseAuthTypes.User) => {
  await firestore()
    .collection('Users')
    .doc(user.uid)
    .update({
      settings: await getStoreSettings(),
    });
};

export const setUserInterests = async (
  user: FirebaseAuthTypes.User,
  interests: UserInterests,
) => {
  await firestore().collection('Users').doc(user.uid).update({
    interests,
  });
};
