import * as React from 'react';
import {Platform, View} from 'react-native';
import {getColor, Theme} from '../../constants/theme/Themes';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import auth from '@react-native-firebase/auth';
import {
  getStorageAutomaticUpdate,
  setStorageAutomaticUpdate,
  setStorageTheme,
} from '../../utils/storage';
import styles from '../../styles/styles';
import {AuthContext} from '../../context/AuthContext';
import {SettingSection, SettingType} from '../../interfaces/Interfaces';
import SectionList from '../../components/lists/SettingsSectionList';
import Alert from '../../components/alerts/CustomAlert';
import {deleteUserContent} from '../../utils/sql';
import {updateFirebaseSettings} from '../../utils/firebase';

/*
General
  Language
  Notifications
  automatic update

Appearance
  App Theme
  Font Size
  Dark mode

User
  View user details
  Your interests


Advanced settings
reset 


*/
export default function SettingsPage({navigation}: {navigation: any}) {
  const [isSignoutAlert, setSignoutAlert] = React.useState<boolean>(false);
  const [isUpdate, setUpdate] = React.useState<boolean>(false);
  const sectionListRef = React.useRef<any>(null);

  React.useEffect(() => {
    (async () => {
      setUpdate(await getStorageAutomaticUpdate());
    })();
  }, []);

  const {translations} = React.useContext(LocalizationContext);

  const {theme, setTheme} = React.useContext(ThemeContext);
  const {user, setDBAuthKey, setUser} = React.useContext(AuthContext);
  const setUpdateSettings = async (newVal: boolean) => {
    await setStorageAutomaticUpdate(newVal);
    if (user) {
      await updateFirebaseSettings(user);
    }
    setUpdate(newVal);
  };

  const onSignOut = async () => {
    await auth().signOut();
    setDBAuthKey(null);
    setUser(null);
    //delete user specific data
    deleteUserContent();
  };

  const changeTheme = async () => {
    const newTheme = theme == Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
    await setStorageTheme(newTheme);
    if (user) {
      await updateFirebaseSettings(user);
    }
  };

  const data: SettingSection[] = [
    {
      title: 'General',
      data: [
        {
          title: translations.LANGUAGE,
          type: SettingType.BASIC,
          selected: isUpdate,
          onPress: () => navigation.navigate('Language'),
          id: 0,
        },

        {
          title: translations.AUTOMATIC_UPDATE,
          type: SettingType.CHECKBOX,
          selected: isUpdate,
          onPress: (newVal: boolean) => setUpdateSettings(newVal),
          id: 1,
        },
        {
          title: 'Notifications',
          type: SettingType.BASIC,
          onPress: () => {},
          id: 3,
        },
      ],
    },

    {
      title: 'Appearance',
      data: [
        {
          title: 'Card Theme',
          type: SettingType.BASIC,
          onPress: () => navigation.navigate('Theme'),
          id: 0,
        },
        {
          title: translations.FONTSIZE,
          type: SettingType.BASIC,
          onPress: () => navigation.navigate('Fontsize'),
          id: 1,
        },
        {
          title: translations.DARK_MODE,
          type: SettingType.CHECKBOX,
          selected: theme === 'dark' ? true : false,
          onPress: changeTheme,
          id: 2,
        },
      ],
    },

    {
      title: 'User',
      data: [
        user
          ? {
              title: 'Sign out',
              type: SettingType.BASIC,
              onPress: () => setSignoutAlert(true),
              id: 0,
            }
          : {
              title: 'Sign in ',
              type: SettingType.BASIC,
              onPress: () =>
                navigation.navigate('Login', {
                  screen: 'LoginScreen',
                }),
              id: 0,
            },
        {
          title: 'Your Interests',
          type: SettingType.BASIC,
          onPress: () => navigation.navigate('Interests'),
          id: 1,
        },

        {
          title: 'User Details',
          type: SettingType.BASIC,
          onPress: () => navigation.navigate('Details'),
          id: 2,
        },
      ],
    },

    {
      title: 'Advanced',
      data: [
        {
          title: 'Reset',
          type: SettingType.BASIC,
          onPress: () => navigation.navigate('Reset'),
          id: 0,
        },
      ],
    },
  ];
  console.log('NNNNNNNNNNN', navigation);
  return (
    <View
      style={[
        styles.DefaultContainer,
        {marginTop: Platform.OS === 'ios' ? 50 : 0},
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      <SectionList
        navigation={navigation}
        items={data}
        sectionListRef={sectionListRef}
      />
      <Alert
        show={isSignoutAlert}
        showProgress={false}
        title="Sign Out"
        message="Are you sure to sign out. Your progress will not be synchronized anymore"
        closeOnTouchOutside={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No,Cancel"
        confirmText="Sign Out"
        onCancelPressed={() => {
          setSignoutAlert(false);
        }}
        onConfirmPressed={() => {
          onSignOut();
          setSignoutAlert(false);
        }}
      />
    </View>
  );
}
