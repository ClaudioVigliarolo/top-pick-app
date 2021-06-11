import * as React from 'react';
import {
  Text,
  View,
  Linking,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
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
import Animated from 'react-native-reanimated';
import {getColor, Theme} from '../constants/theme/Themes';
import translations from '../context/translations';
import styles from '../styles/styles';
import {setStorageTheme} from '../utils/utils';

const CustomDrawer = ({progress, ...props}: {progress: number; props: any}) => {
  const {theme, setTheme} = React.useContext(ThemeContext);

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const changeTheme = async () => {
    const newTheme = theme == Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
    await setStorageTheme(newTheme);
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
          <Text style={styles.CustomDrawerfooterText}>
            {translations.LEAVE_RATING}
          </Text>
        </TouchableWithoutFeedback>
      </Footer>
    </Container>
  );
};

export default CustomDrawer;
