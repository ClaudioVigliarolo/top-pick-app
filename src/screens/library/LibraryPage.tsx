import * as React from 'react';
import {TabButton} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import Tabs from '../../components/buttons/Tabs';
import CategoriesPage from './CategoriesPage';
import AllTopicsPage from './AllTopicsPage';
import AllDialogsPage from './AllDialogsPage';
import NewTopicsPage from './NewTopicsPage';
import {useRoute} from '@react-navigation/native';

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
    },
    {
      heading: translations.TOPICS,
      children: <AllTopicsPage navigation={navigation} />,
    },
    {
      heading: translations.DIALOGS,
      children: <AllDialogsPage navigation={navigation} />,
    },
    {
      heading: 'Newly Added',
      children: <NewTopicsPage navigation={navigation} />,
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
