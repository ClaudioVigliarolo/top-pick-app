import React from 'react';
import {View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ArticleCardItem from '../../../components/lists/ArticleCardItem';
import {Question} from '../../../interfaces/Interfaces';

/*const questions: Question[] = [
  {
    id: 1,
    title: 'Do you know any good books about coffee?',
    description:
      'One of the most enjoyable things in life is when two passions begin to overlap. And for me, that is coffee and books. I love coffee in just about any shape, method, or form. And I love reading everything from novels to history to geeky coffee books.',
    topic_id: -1,
    link: 'https://thecoffeefolk.com/best-coffee-books/',
    n: 2,
  },

  {
    id: 2,
    title: 'Do you know any good books about coffee?',
    description:
      'One of the most enjoyable things in life is when two passions begin to overlap. And for me, that is coffee and books. I love coffee in just about any shape, method, or form. And I love reading everything from novels to history to geeky coffee books.',
    topic_id: -1,
    link: 'https://www.youtube.com/watch?v=Kmiw4FYTg2U',
    n: 2,
  },
];*/
interface AnswersPageProps {
  questions: Question[];
}

export default function AnswersPage({questions}: AnswersPageProps) {
  return (
    <ScrollView>
      {questions
        .filter((q) => q.link)
        .map((q) => (
          <ArticleCardItem
            key={q.id}
            questionDescription={q.description as string}
            questionN={q.n as number}
            questionTitle={q.title}
            questionUrl={q.link as string}
          />
        ))}
    </ScrollView>
  );
}
