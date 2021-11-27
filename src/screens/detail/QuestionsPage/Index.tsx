import * as React from 'react';
import {
  Lang,
  NavTab,
  Question,
  TabButton,
  Topic,
} from '../../../interfaces/Interfaces';
import translations from '../../../context/translations';
import {
  getQuestionsByTopic,
  getRelatedTopics,
  getTopicById,
} from '../../../utils/storage/sql';
import QuestionsPage from './QuestionsPage';
import ArticlesPage from './ArticlesPage';
import QuestionsTabs from '../../../components/tabs/QuestionsTabs';
import ImagesPage from '../ImagesPage/ImagesPage';
import {LocalizationContext} from '../../../context/LocalizationContext';

const NO_TOPIC = {
  id: 0,
  title: '',
};

export default function LibraryPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const [topic, setTopic] = React.useState<Topic>(NO_TOPIC);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [related, setRelated] = React.useState<Topic[]>([]);
  const {id, title}: {id: number; title: string} = route.params;
  const {contentLanguage} = React.useContext(LocalizationContext);
  React.useEffect(() => {
    (async () => {
      setTopic({
        id,
        title,
      });
      const topic = await getTopicById(id);
      if (topic) {
        setTopic(topic);
        console.log('my toooo', topic);
        const questions: Question[] = await getQuestionsByTopic(topic.id);
        questions.forEach(function (element: Question) {
          element['selected'] = false;
        });

        setQuestions(questions);
        const related: Topic[] = await getRelatedTopics(
          topic.ref_id as number,
          contentLanguage,
        );
        console.log('qqq', questions);
        setRelated(related);
      }
    })();
  }, []);

  const onSelect = (index: number): void => {
    const newQuestions = [...questions];
    newQuestions[index]['selected'] = !newQuestions[index]['selected'];
    setQuestions(newQuestions.slice());
  };

  const tabs: TabButton[] = [
    {
      heading: translations.QUESTIONS,
      children: (
        <QuestionsPage
          onSelect={onSelect}
          related={related}
          topic={topic}
          questions={questions}
        />
      ),
      id: 0,
      visible: true,
    },
    {
      heading: 'articles',
      children: <ArticlesPage questions={questions} />,
      id: 1,
      visible: questions.filter((q) => q.link).length > 0,
    },
    /*
     {
      heading: 'Images',
      children: <ImagesPage />,
      id: 2,
    },
    */
  ];

  return <QuestionsTabs tabs={tabs.filter((q) => q.visible)} initialPage={0} />;
}
