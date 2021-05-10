import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Linking,
  TouchableWithoutFeedback,
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
import AsyncStorage from '@react-native-community/async-storage';
import Animated from 'react-native-reanimated';
import {getColor} from '../constants/Themes';

import Dimensions from '../constants/Dimensions';
import keys from '../../database/keys/keys';
import translations from '../context/translations';

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

  const styles = StyleSheet.create({
    container: {
      backgroundColor: getColor(theme, 'primaryBackground'),
    },
    header: {
      backgroundColor: getColor(theme, 'primaryOrange'),
      borderBottomWidth: 0,
      height: 100,
    },
    headerText: {
      color: '#fff',
      fontSize: Dimensions.fontMed,
      paddingRight: 5,
    },
    footerText: {
      color: '#fff',
      fontSize: Dimensions.fontSmall,
      marginLeft: 20,
    },

    footerContainer: {
      backgroundColor: getColor(theme, 'lighterOrange'),
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    listItemContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    listItemText: {
      color: getColor(theme, 'drawerGrey'),
      paddingRight: 20,
    },
  });

  return (
    <Container style={styles.container}>
      <Header style={styles.header}>
        <Right>
          <Text style={styles.headerText}>TOP Picks</Text>
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
            <View style={styles.listItemContainer}>
              <Text style={styles.listItemText}>
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

      <Footer style={styles.footerContainer}>
        <TouchableWithoutFeedback
          onPress={() => Linking.openURL('market://details?id=com.topick')}>
          <Text style={styles.footerText}>Leave a rating</Text>
        </TouchableWithoutFeedback>
      </Footer>
    </Container>
  );
};

export default CustomDrawer;
