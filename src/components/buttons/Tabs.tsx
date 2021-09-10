import React from 'react';
import {Tab, Tabs} from 'native-base';
import {TabButton} from '../../interfaces/Interfaces';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import {ScrollableTab} from 'native-base';

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
  return <ScrollableTab {...props} />;
};

export default function TabButtons({tabs, initialPage = 0}: TabButtonsProps) {
  const {theme} = React.useContext(ThemeContext);
  return (
    <Tabs
      renderTabBar={renderScrollableTab}
      initialPage={initialPage}
      scrollWithoutAnimation={true}
      tabBarUnderlineStyle={{
        backgroundColor: getColor(theme, 'primaryOrange'),
        height: 2,
      }}>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          heading={tab.heading}
          tabStyle={{backgroundColor: getColor(theme, 'primaryBackground')}}
          textStyle={{color: getColor(theme, 'primaryOrange')}}
          activeTabStyle={{
            backgroundColor: getColor(theme, 'primaryBackground'),
            borderColor: 'red',
          }}
          activeTextStyle={{color: getColor(theme, 'primaryOrange')}}
          children={tab.children}
        />
      ))}
    </Tabs>
  );
}
