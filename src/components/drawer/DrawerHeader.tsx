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
import {syncToServer} from '../../utils/cloud/api';
import {StatusContext} from '../../context/StatusContext';

const CustomDrawer = ({navigation}: {navigation: any}) => {
  const {theme} = React.useContext(ThemeContext);
  const {user, DBAuthKey} = React.useContext(AuthContext);
  const {
    isSyncUserContent,
    isSyncUserContentError,
    isSyncUserContentLoading,
    setSyncUserContent,
    setSyncUserContentLoading,
    setSyncUserContentError,
  } = React.useContext(StatusContext);

  const goSignIn = () => {
    navigation.navigate('Login', {
      screen: 'LoginScreen',
    });
  };

  const onsyncToServer = async () => {
    if (DBAuthKey) {
      setSyncUserContentLoading(true);
      if (await syncToServer(DBAuthKey)) {
        setSyncUserContent(true);
      }
      setSyncUserContentLoading(false);
    }
  };

  const renderSyncButton = () => {
    if (isSyncUserContentLoading) {
      return (
        <Text style={styles.CustomDrawerSyncText} numberOfLines={1}>
          Loading...
        </Text>
      );
    }

    if (isSyncUserContent) {
      return (
        <TouchableOpacity onPress={goSignIn}>
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
        <TouchableOpacity onPress={onsyncToServer}>
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
            <TouchableOpacity onPress={goSignIn}>
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
