import React from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {WEB_CLIENT_ID} from '../config/config';
import {UserSettings} from '../interfaces/Interfaces';
import {loadSettings} from '../utils/storage';

export const AuthContext = React.createContext({
  user: null as FirebaseAuthTypes.User | null,
  setUser: (user: FirebaseAuthTypes.User | null) => {},
  DBAuthKey: null as number | null,
  setDBAuthKey: (key: null | number) => {},
});

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);
  const [DBAuthKey, setDBAuthKey] = React.useState<number | null>(null);

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged as any);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User) => {
    setUser(user);

    if (user) {
      //transaction
      const userDocument = (
        await firestore().collection('Users').doc(user.uid).get()
      ).data();

      if (userDocument) {
        //set db key to sign requests
        setDBAuthKey(userDocument.DBAuthKey);
        //load settings
        await loadSettings(userDocument.settings as UserSettings);
      }
    }
    console.log('LOGGG', user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        DBAuthKey,
        setDBAuthKey,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
