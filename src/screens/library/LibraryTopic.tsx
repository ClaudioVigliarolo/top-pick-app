import * as React from 'react';
import {TabButton} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import Tabs from '../../components/buttons/Tabs';
import TopicsPage from './TopicsPage';
import DialogPage from './DialogPage';
export default function LibraryDetail({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const {translations} = React.useContext(LocalizationContext);

  const tabs: TabButton[] = [
    {
      heading: translations.TOPICS,
      children: <TopicsPage navigation={navigation} route={route} />,
      id: 1,
    },
    {
      heading: translations.DIALOGS,
      children: <DialogPage navigation={navigation} route={route} />,
      id: 2,
    },
  ];

  return <Tabs tabs={tabs} />;
}
