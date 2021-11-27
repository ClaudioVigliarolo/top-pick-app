import React from 'react';
import {View} from 'react-native';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import {TabButton} from '../../interfaces/Interfaces';
import styles from '../../styles/styles';
import Tab from '../tabs/NavTab';
interface QuestionsTabsProps {
  tabs: TabButton[];
  initialPage: number;
}
export default function QuestionsTabs({initialPage, tabs}: QuestionsTabsProps) {
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const {theme} = React.useContext(ThemeContext);

  React.useEffect(() => {
    setCurrentTab(initialPage);
  }, []);
  return (
    <View
      style={[
        styles.DefaultContainer,
        {backgroundColor: getColor(theme, 'questionsTabBackground')},
      ]}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            onNav={() => setCurrentTab(tab.id)}
            selected={currentTab === tab.id}
            title={tab.heading}
            children={tab.children}
          />
        ))}
      </View>
      {tabs[currentTab].children}
    </View>
  );
}
