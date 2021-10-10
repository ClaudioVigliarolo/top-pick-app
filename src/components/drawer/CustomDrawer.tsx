import * as React from 'react';
import {Text, View, Platform} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Container, Content, ListItem, Switch, List} from 'native-base';
import Animated from 'react-native-reanimated';
import {getColor, Theme} from '../../constants/theme/Themes';
import translations from '../../context/translations';
import styles from '../../styles/styles';
import {setStorageTheme} from '../../utils/storage';
import {AuthContext} from '../../context/AuthContext';
import DrawerHeader from './DrawerHeader';
import DrawerFooter from './DrawerFooter';
import {updateFirebaseSettings} from '../../utils/firebase';

const CustomDrawer = ({progress, ...props}: {progress: number; props: any}) => {
  const {theme, setTheme} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const changeTheme = async () => {
    const newTheme = theme == Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
    await setStorageTheme(newTheme);
    if (user) {
      await updateFirebaseSettings(user);
    }
  };

  return (
    <Container style={{backgroundColor: getColor(theme, 'primaryBackground')}}>
      <DrawerHeader navigation={props.navigation} />
      <Content>
        <DrawerContentScrollView {...props}>
          <Animated.View
            style={{
              transform: [{translateX}],
              marginTop: Platform.OS === 'ios' ? -20 : 0,
            }}>
            <DrawerItemList {...(props as any)} />
          </Animated.View>
        </DrawerContentScrollView>
        <List>
          <ListItem>
            <View style={styles.CustomDrawerListItemContainer}>
              <Text
                style={[
                  styles.CustomDrawerListItemText,
                  {color: getColor(theme, 'drawerGrey')},
                ]}>
                {theme === 'dark'
                  ? translations.DARK_MODE
                  : translations.LIGHT_MODE}
              </Text>
              <Switch
                onValueChange={changeTheme}
                thumbColor={getColor(theme, 'primaryOrange')}
                value={theme === 'dark' ? true : false}
                trackColor={{
                  true: getColor(theme, 'checkOrange'),
                  false: getColor(theme, 'lighterGray'),
                }}></Switch>
            </View>
          </ListItem>
        </List>
      </Content>
      <DrawerFooter />
    </Container>
  );
};

export default CustomDrawer;
