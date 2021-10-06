import React, {useState} from 'react';
import {Form, Item, Input} from 'native-base';
import {View} from 'native-base';
import {Alert, Text, TouchableOpacity} from 'react-native';
import Button from '../../components/buttons/CustomButton';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';

import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from '@react-native-google-signin/google-signin';

import styles from '../../styles/styles';
import SkipIcon from '../../components/icons/SkipIcon';
import {useNavigation} from '@react-navigation/native';
import {WEB_CLIENT_ID} from '../../config/config';
import auth from '@react-native-firebase/auth';
import BackIcon from '../../components/icons/BackIcon';
import {
  isFirstLaunch as hasAppLaunched,
  onTopicsUpdate,
} from '../../utils/utils';
import {AuthContext} from '../../context/AuthContext';
import {REDIRECT_HOME} from '../../constants/app/App';
import {createClientDb} from '../../utils/api';
import {Lang} from '../../interfaces/Interfaces';
import translations from '../../context/translations';
import {StatusContext} from '../../context/StatusContext';

export default function RegisterForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isFirstLaunch, setFirstLaunch] = React.useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const {theme} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);
  const {setLoadingContent} = React.useContext(StatusContext);

  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      setFirstLaunch(await hasAppLaunched());
    })();
  }, []);

  React.useEffect(() => {
    //redirect home
    if (user) {
      setTimeout(async () => {
        navigation.navigate('HomeScreen');
        onTopicsUpdate(
          user.uid,
          translations.LANG as Lang,
          setLoadingContent,
          (success) => {},
        );
      }, REDIRECT_HOME);
    }
  }, [user]);

  const signUp = () => {
    setLoading(true);
    console.log('start');
    setError('');
    if (!email || !password) {
      setLoading(false);
      setError('please all fields');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('User account created & signed in!');
        //add client to db
        createClientDb(user.user);
        setLoading(false);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setError('mail already in use');
        }

        if (error.code === 'auth/invalid-email') {
          setError('That email address is invalid!');
        }

        console.log(error);
        setError('Failed to create account');
      });
    setLoading(false);
  };

  const onGoogleSignIn = async () => {
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    const res = await auth().signInWithCredential(googleCredential);
    createClientDb(res.user);
  };

  return (
    <View
      style={[
        styles.DefaultContainerCenter,
        {
          backgroundColor: getColor(theme, 'primaryOrange'),
        },
      ]}>
      {isFirstLaunch ? (
        <SkipIcon
          onPress={() => {
            navigation.goBack();
          }}
        />
      ) : (
        <BackIcon
          onPress={() => {
            navigation.goBack();
          }}
        />
      )}

      <View style={styles.authContainer}>
        <Form>
          <View>
            <Text style={styles.header}>Register</Text>
          </View>
          <Item>
            <Input
              placeholder="Mail"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </Item>
          <Item>
            <Input
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </Item>

          <View style={{width: '50%', alignSelf: 'center'}}>
            <View style={styles.marginSmall}>
              {<Text style={styles.errorText}>{error}</Text>}
              {user && <Text style={styles.successText}>Logged In</Text>}
            </View>

            <Button
              color={getColor(theme, 'primaryOrange')}
              title="Sign Up"
              onPress={signUp}
              loading={loading}
            />
          </View>
          <View style={styles.marginSmall}>
            <Text
              style={{textAlign: 'center', color: 'grey', marginBottom: 10}}>
              Or
            </Text>
            <GoogleSigninButton
              style={styles.signInButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={onGoogleSignIn}
            />
          </View>
          <View style={styles.marginSmall}>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text
                style={[
                  styles.changeAuthText,
                  {
                    color: getColor(theme, 'primaryOrange'),
                  },
                ]}>
                I already have an account
              </Text>
            </TouchableOpacity>
          </View>
        </Form>
      </View>
    </View>
  );
}
