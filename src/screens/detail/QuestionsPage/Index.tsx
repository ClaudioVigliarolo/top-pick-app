import * as React from 'react';
import {TabButton} from '../../../interfaces/Interfaces';
import Tabs from '../../../components/buttons/Tabs';
import QuestionsPage from './QuestionsPage';
import AnswersPage from './AnswersPage';

export default function LibraryPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const {id, title}: {id: number; title: string} = route.params;
  const tabs: TabButton[] = [
    {
      heading: 'Questions',
      children: <QuestionsPage id={id} title={title} />,
      id: 0,
    },
    {
      heading: 'Answers',
      children: <AnswersPage />,
      id: 1,
    },
  ];
  return <Tabs tabs={tabs} initialPage={1} />;
}
