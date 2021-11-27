import * as React from 'react';
import LevelEasyPage from './LevelEasyPage';
import LevelMediumPage from './LevelMediumPage';
import LevelHardPage from './LevelHardPage';
import {TabButton} from '../../../interfaces/Interfaces';
import Tabs from '../../../components/tabs/Tabs';

export default function LibraryPage({navigation}: {navigation: any}) {
  const tabs: TabButton[] = [
    {
      heading: 'Easy',
      children: <LevelEasyPage navigation={navigation} />,
      id: 0,
    },
    {
      heading: 'Medium',
      children: <LevelMediumPage navigation={navigation} />,
      id: 1,
    },
    {
      heading: 'Hard',
      children: <LevelHardPage navigation={navigation} />,
      id: 2,
    },
  ];
  return <Tabs tabs={tabs} initialPage={1} />;
}
