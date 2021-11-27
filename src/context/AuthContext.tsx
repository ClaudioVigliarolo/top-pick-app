import React from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {WEB_CLIENT_ID} from '../config/config';
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
    return subscriber;
  }, []);

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User) => {
    if (user) {
      setUser(user);
    }
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
