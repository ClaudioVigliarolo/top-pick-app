import * as React from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {Header, Right} from 'native-base';
import {getColor} from '../../constants/theme/Themes';
import styles from '../../styles/styles';
import {Left} from 'native-base';
import {AuthContext} from '../../context/AuthContext';
import {syncDB} from '../../utils/api';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {StatusContext} from '../../context/StatusContext';

const CustomDrawer = ({navigation}: {navigation: any}) => {
  const {theme} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);
  const {
    isSyncedUserContent,
    isSyncingUserContent,
    setSyncedUserContent,
    setSyncingUserContent,
  } = React.useContext(StatusContext);

  const goLoginPage = () => {
    navigation.navigate('Login', {
      screen: 'LoginScreen',
    });
  };

  const onSyncDB = async () => {
    setSyncingUserContent(true);
    if (await syncDB(user as FirebaseAuthTypes.User)) {
      setSyncedUserContent(true);
    } else {
      setSyncedUserContent(false);
    }
    setSyncingUserContent(false);
  };

  const renderSyncButton = () => {
    if (isSyncingUserContent) {
      return (
        <Text style={styles.CustomDrawerSyncText} numberOfLines={1}>
          Loading...
        </Text>
      );
    }

    if (isSyncedUserContent) {
      return (
        <TouchableOpacity onPress={goLoginPage}>
          <Text
            style={[
              styles.CustomDrawerSyncText,
              {
                color: getColor(theme, 'white'),
              },
            ]}>
            Looks Good
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={onSyncDB}>
          <Text style={styles.CustomDrawerSyncText} numberOfLines={1}>
            Sync now
          </Text>
        </TouchableOpacity>
      );
    }
  };
  return (
    <Header
      style={[
        styles.CustomDrawerHeader,
        {backgroundColor: getColor(theme, 'primaryOrange')},
      ]}>
      <Left>
        {user ? (
          <View>
            <TouchableWithoutFeedback>
              <Text style={styles.CustomDrawerUsername} numberOfLines={1}>
                Hi, {user.displayName?.split(' ')[0]}
              </Text>
            </TouchableWithoutFeedback>
            {renderSyncButton()}
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={goLoginPage}>
              <Text style={styles.CustomDrawerSignInText}>Sign in</Text>
            </TouchableOpacity>
          </>
        )}
      </Left>
      <Right>
        <Text style={styles.CustomDrawerheaderText}>TOP Pick</Text>
      </Right>
    </Header>
  );
};

export default CustomDrawer;
