import * as React from 'react';
import {LIBRARY_TABS, TabButton} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import Tabs from '../../components/buttons/Tabs';
import CategoriesPage from './CategoriesPage';
import AllTopicsPage from './AllTopicsPage';
import AllDialogsPage from './AllDialogsPage';
import NewTopicsPage from './NewTopicsPage';
import {useRoute} from '@react-navigation/native';
import LevelEasyPage from './LevelEasyPage';
import LevelMediumPage from './LevelMediumPage';
import LevelHardPage from './LevelHardPage';

export default function LibraryPage({navigation}: {navigation: any}) {
  const {translations} = React.useContext(LocalizationContext);
  const [initialPage, setInitialPage] = React.useState<number | null>(null);
  const route: any = useRoute();

  React.useEffect(() => {
    if (route.params && route.params.index) {
      setInitialPage(route.params.index);
    } else {
      setInitialPage(0);
    }
  }, []);

  const tabs: TabButton[] = [
    {
      heading: translations.CATEGORIES,
      children: <CategoriesPage navigation={navigation} />,
      id: LIBRARY_TABS.CATEGORIES,
    },
    {
      heading: translations.TOPICS,
      children: <AllTopicsPage navigation={navigation} />,
      id: LIBRARY_TABS.TOPICS,
    },

    {
      heading: translations.DIALOGS,
      children: <AllDialogsPage navigation={navigation} />,
      id: LIBRARY_TABS.DIALOGS,
    },
    {
      heading: 'Easy',
      children: <LevelEasyPage navigation={navigation} />,
      id: LIBRARY_TABS.EASY,
    },
    {
      heading: 'Medium',
      children: <LevelMediumPage navigation={navigation} />,
      id: LIBRARY_TABS.MEDIUM,
    },
    {
      heading: 'Hard',
      children: <LevelHardPage navigation={navigation} />,
      id: LIBRARY_TABS.HARD,
    },
    {
      heading: 'Newly Added',
      children: <NewTopicsPage navigation={navigation} />,
      id: LIBRARY_TABS.NEWLY_ADDED,
    },
  ];
  return (
    <>
      {initialPage !== null && (
        <Tabs tabs={tabs} initialPage={initialPage as number} />
      )}
    </>
  );
}
