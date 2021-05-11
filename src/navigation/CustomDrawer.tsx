import * as React from 'react';
import {Text, View, Linking, TouchableWithoutFeedback} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  Container,
  Header,
  Footer,
  Content,
  ListItem,
  Right,
  Switch,
  List,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Animated from 'react-native-reanimated';
import {getColor} from '../constants/Themes';
import keys from '../../database/keys/keys';
import translations from '../context/translations';
import styles from '../styles/styles';

const CustomDrawer = ({progress, ...props}: {progress: number; props: any}) => {
  const {theme, setTheme} = React.useContext(ThemeContext);

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const changeTheme = async () => {
    try {
      const newTheme = theme == 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem(keys.THEME_KEY, newTheme);
    } catch (e) {}
  };

  return (
    <Container style={{backgroundColor: getColor(theme, 'primaryBackground')}}>
      <Header
        style={[
          styles.CustomDrawerHeader,
          {backgroundColor: getColor(theme, 'primaryOrange')},
        ]}>
        <Right>
          <Text style={styles.CustomDrawerheaderText}>TOP Picks</Text>
        </Right>
      </Header>
      <Content>
        <DrawerContentScrollView {...props}>
          <Animated.View style={{transform: [{translateX}]}}>
            <DrawerItemList {...props} />
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
                {theme == 'dark'
                  ? translations.LIGHT_MODE
                  : translations.DARK_MODE}
              </Text>
              <Switch
                onValueChange={changeTheme}
                thumbColor={getColor(theme, 'primaryOrange')}
                value={theme == 'dark' ? true : false}
                trackColor={{
                  true: getColor(theme, 'checkOrange'),
                  false: getColor(theme, 'lighterGray'),
                }}></Switch>
            </View>
          </ListItem>
        </List>
      </Content>

      <Footer
        style={[
          styles.CustomDrawerFooterContainer,
          {backgroundColor: getColor(theme, 'lighterOrange')},
        ]}>
        <TouchableWithoutFeedback
          onPress={() => Linking.openURL('market://details?id=com.topick')}>
          <Text style={[styles.CustomDrawerfooterText]}>
            {translations.LEAVE_RATING}
          </Text>
        </TouchableWithoutFeedback>
      </Footer>
    </Container>
  );
};

export default CustomDrawer;
