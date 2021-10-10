import React, {useState} from 'react';
import {Form, Item, Input} from 'native-base';
import {View} from 'native-base';
import {Alert, Text, TouchableOpacity} from 'react-native';
import Button from '../../components/buttons/CustomButton';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import styles from '../../styles/styles';
import {useNavigation} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import BackIcon from '../../components/icons/BackIcon';
import {isFirstLaunch as hasAppLaunched} from '../../utils/storage';
import SkipIcon from '../../components/icons/SkipIcon';
import {AuthContext} from '../../context/AuthContext';
import {REDIRECT_HOME} from '../../constants/app/App';
import translations from '../../context/translations';
import {Lang, SettingType, UserSettings} from '../../interfaces/Interfaces';
import {StatusContext} from '../../context/StatusContext';
import {createUserData} from '../../utils/firebase';
import {createClientDb} from '../../utils/api';
import {getDeviceToken, onTopicsUpdate} from '../../utils/utils';
import Settings from '../../components/tabs/Tab';
export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isFirstLaunch, setFirstLaunch] = React.useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const {theme} = React.useContext(ThemeContext);
  const {user, setDBAuthKey} = React.useContext(AuthContext);
  const {setLoadingContent} = React.useContext(StatusContext);
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
        onTopicsUpdate(
          user ? user.uid : await getDeviceToken(),
          translations.LANG as Lang,
          setLoadingContent,
          (success) => {},
        );
      }, REDIRECT_HOME);
    }
  }, [user]);

  const loadSettings = async (user: FirebaseAuthTypes.User) => {
    console.log('GIA PRESENTE LLLOADING');
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
    console.log('start');
    setError('');
    if (!email || !password) {
      setLoading(false);
      setError('please all fields');
      return;
    }
    try {
      const res = await auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in!');
      console.log('KLLL SETTINGS');

      loadSettings(res.user);
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
      console.log('MIE INFOOOOOOOOOOOOO', res.additionalUserInfo);
      if (res.additionalUserInfo?.isNewUser) {
        //create user data
        Alert.alert('is nw');
        const userData = await createUserData(res.user);
        if (userData) {
          await createClientDb(res.user.uid, userData.DBAuthKey);
          setDBAuthKey(userData.DBAuthKey);
        }
      } else {
        loadSettings(res.user);
      }
    } catch (error) {
      setError('Failed to sign in with Google');
    }
    setLoading(false);
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
            <Text style={styles.header}>Login</Text>
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
        </Form>
      </View>
    </View>
  );
}
