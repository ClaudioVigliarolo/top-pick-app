import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import {HomeStack, SearchStack} from './StackNavigator';
import {TabBar} from '../navigation/TabBar';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  const isTabVisible = (route: any): boolean => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    if (routeName === 'Questions') {
      return false;
    }
    return true;
  };

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          showLabel: false,
          keyboardHidesTabBar: false,
        }}
        tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={({route}) => ({
            tabBarVisible: ((route) => {
              return isTabVisible(route);
            })(route),
          })}
        />

        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={({route}) => ({
            tabBarVisible: ((route) => {
              return isTabVisible(route);
            })(route),
          })}
        />
      </Tab.Navigator>
    </View>
  );
};

export {TabNavigator};
