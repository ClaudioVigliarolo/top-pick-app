import React, {useState} from 'react';
import {Form, Item, Input} from 'native-base';
import {View} from 'native-base';
import {Text, TouchableOpacity} from 'react-native';
import Button from '../../components/buttons/CustomButton';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import styles from '../../styles/styles';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import BackIcon from '../../components/icons/BackIcon';
import {
  isFirstLaunch as hasAppLaunched,
  onTopicsUpdate,
} from '../../utils/utils';
import SkipIcon from '../../components/icons/SkipIcon';
import {AuthContext} from '../../context/AuthContext';
import {REDIRECT_HOME} from '../../constants/app/App';
import translations from '../../context/translations';
import {Lang} from '../../interfaces/Interfaces';
import {StatusContext} from '../../context/StatusContext';

export default function LoginForm() {
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

  const signIn = () => {
    setLoading(true);
    console.log('start');
    setError('');
    if (!email || !password) {
      setLoading(false);
      setError('please all fields');
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError('Invalid Credentials');
      });
    setLoading(false);
  };

  const onGoogleSignIn = async () => {
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
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
              {user && <Text style={styles.successText}>Logged In</Text>}
            </View>

            <Button
              color={getColor(theme, 'primaryOrange')}
              title="Login"
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
