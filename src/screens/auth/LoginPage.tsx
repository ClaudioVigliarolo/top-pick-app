import React, {useRef, useState} from 'react';
import {Form, Item, Input} from 'native-base';
import {View} from 'native-base';
import {Alert, Text, TouchableOpacity} from 'react-native';
import Button from '../../components/buttons/CustomButton';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import styles from '../../styles/styles';
import {useNavigation} from '@react-navigation/native';
import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import BackIcon from '../../components/icons/BackIcon';
import {isFirstLaunch as hasAppLaunched} from '../../utils/storage/storage';
import SkipIcon from '../../components/icons/SkipIcon';
import {AuthContext} from '../../context/AuthContext';
import {REDIRECT_HOME} from '../../constants/app/App';
import {Lang, SettingType, UserSettings} from '../../interfaces/Interfaces';
import {StatusContext} from '../../context/StatusContext';
import {createUserData} from '../../utils/cloud/firebase';
import {createClientDb} from '../../utils/cloud/api';
import DialogInput from 'react-native-dialog-input';
export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [
    ismodalPasswordReset,
    setIsModalPasswordReset,
  ] = React.useState<boolean>(false);
  const [isFirstLaunch, setFirstLaunch] = React.useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const {theme} = React.useContext(ThemeContext);
  const {user, setDBAuthKey} = React.useContext(AuthContext);
  const {onContentUpdate} = React.useContext(StatusContext);
  const {setTheme, setCardtheme, setFontsize} = React.useContext(ThemeContext);

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
        onContentUpdate();
      }, REDIRECT_HOME);
    }
  }, [user]);

  const checkLanguageDownload = async (user: FirebaseAuthTypes.User) => {
    const userDocument = (
      await firestore().collection('Users').doc(user.uid).get()
    ).data();

    if (userDocument) {
      //set db key to sign requests
      setDBAuthKey(userDocument.DBAuthKey);
      //load settings
      const currentSettings: UserSettings = userDocument.settings;
      setTheme(currentSettings.darkMode);
      setCardtheme(currentSettings.cardTheme);
      setFontsize(currentSettings.fontSize);
    }
  };
  const signIn = async () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      setError('please all fields');
      return;
    }
    try {
      const res = await auth().signInWithEmailAndPassword(email, password);
      checkLanguageDownload(res.user);
    } catch (error) {
      setError('Invalid Credentials');
    }
    setLoading(false);
  };

  const onGoogleSignIn = async () => {
    setLoading(true);
    try {
      const {idToken} = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      const res = await auth().signInWithCredential(googleCredential);
      if (res.additionalUserInfo?.isNewUser) {
        //create user data
        Alert.alert('is nw');
        const userData = await createUserData(res.user);
        if (userData) {
          await createClientDb(res.user.uid, userData.DBAuthKey);
          setDBAuthKey(userData.DBAuthKey);
        }
      }
    } catch (error) {
      setError('Failed to sign in with Google');
    }
    setLoading(false);
  };

  const handlePasswordReset = async (newMail: string) => {
    try {
      console.log('nnnn', newMail);
      await firebase.auth().sendPasswordResetEmail(newMail);
    } catch (error) {
      console.log(error);
    }
    setIsModalPasswordReset(false);
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
          left="3%"
          top="3%"
          color="#fff"
          onPress={() => {
            navigation.goBack();
          }}
        />
      )}

      <View style={styles.authContainer}>
        <Form>
          <View>
            <Text
              style={[
                styles.header,
                {color: getColor(theme, 'primaryOrange')},
              ]}>
              Login
            </Text>
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
              {user && <Text style={styles.successText}>Signed In</Text>}
            </View>
            <Button
              color={getColor(theme, 'primaryOrange')}
              title="Login"
              minWidth={'100%'}
              loading={loading}
              onPress={signIn}
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
              disabled={loading}
            />
          </View>
          <View style={styles.marginSmall}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RegisterScreen');
              }}>
              <Text
                style={[
                  styles.changeAuthText,
                  {
                    color: getColor(theme, 'primaryOrange'),
                  },
                ]}>
                I don't have an account
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.marginSmall}>
            <TouchableOpacity
              onPress={() => {
                setIsModalPasswordReset(true);
              }}>
              <Text
                style={[
                  styles.changeAuthText,
                  {
                    color: getColor(theme, 'darkOrange'),
                  },
                ]}>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>
          <DialogInput
            isDialogVisible={ismodalPasswordReset}
            title={'Reset Password'}
            message={'You can reset your password at this email'}
            hintInput={'example@gmail.com'}
            submitInput={handlePasswordReset}
            closeDialog={() => setIsModalPasswordReset(false)}
          />
        </Form>
      </View>
    </View>
  );
}
