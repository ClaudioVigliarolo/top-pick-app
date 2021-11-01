import React from 'react';
import {Tab, Tabs} from 'native-base';
import {TabButton} from '../../interfaces/Interfaces';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import {ScrollableTab} from 'native-base';
import {Dimensions} from 'react-native';

interface TabButtonsProps {
  tabs: TabButton[];
  initialPage?: number;
}

declare module 'native-base' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export class DefaultTabBar extends React.Component<any, any> {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderScrollableTab = (props: any) => {
  props.tabStyle = Object.create(props.tabStyle);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <ScrollableTab
      {...props}
      style={{
        width: 400,
        height: 50,
        marginTop: 0,
      }}
      tabsContainerStyle={{width: 400}}
    />
  );
};

export default function TabButtons({tabs, initialPage = 0}: TabButtonsProps) {
  const {theme} = React.useContext(ThemeContext);
  return (
    <Tabs
      renderTabBar={renderScrollableTab}
      initialPage={initialPage}
      style={{alignItems: 'center'}}
      scrollWithoutAnimation={true}
      tabBarUnderlineStyle={{
        backgroundColor: getColor(theme, 'primaryOrange'),
        height: 2,
      }}>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          heading={tab.heading}
          tabStyle={{
            width: 150,
            backgroundColor: getColor(theme, 'primaryBackground'),
          }}
          activeTabStyle={{
            width: 150,
            backgroundColor: getColor(theme, 'primaryBackground'),
          }}
          activeTextStyle={{color: getColor(theme, 'primaryOrange')}}
          children={tab.children}
        />
      ))}
    </Tabs>
  );
}
