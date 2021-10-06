import React from 'react';
//import {User} from '../interfaces/Interfaces';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {WEB_CLIENT_ID} from '../config/config';

export const AuthContext = React.createContext({
  user: null as FirebaseAuthTypes.User | null,
  setUser: (user: FirebaseAuthTypes.User) => {},
});

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged as any);
    return subscriber; // unsubscribe on unmount
  }, []);
  const onAuthStateChanged = (user: FirebaseAuthTypes.User) => {
    setUser(user);
    console.log('LOGGG', user);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
