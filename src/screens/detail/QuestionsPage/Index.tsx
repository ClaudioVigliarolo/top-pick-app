import * as React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {copilot} from 'react-native-copilot';
import {ThemeContext} from '../../../context/ThemeContext';
import {
  HelpScreen,
  Lang,
  Question,
  Topic,
} from '../../../interfaces/Interfaces';
import {LocalizationContext} from '../../../context/LocalizationContext';
import {getColor} from '../../../constants/theme/Themes';
import ListItem from '../../../components/lists/ListItemCheckbox';
import {
  getQuestionsByTopic,
  getRelatedTopics,
  getTopicById,
} from '../../../utils/sql';
import styles from '../../../styles/styles';
import {getFontSize} from '../../../constants/theme/Fonts';
import {getTopicLevelColor, getTopicLevelLabel} from '../../../utils/utils';
import {HelpContext} from '../../../context/HelpContext';
import {ListItemHelp, ButtonQuestionsHelp, SearchBarHelp} from './Help';

interface QuestionsPageProps {
  copilotEvents: any;
  start: any;
  route: any;
  navigation: any;
}

function QuestionsPage({
  copilotEvents,
  navigation,
  route,
  start,
}: QuestionsPageProps) {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [topic, setTopic] = React.useState<Topic>({
    id: 0,
    title: '',
  });
  const [related, setRelated] = React.useState<Topic[]>([]);
  const [filter, setFilter] = React.useState('');
  const [counter, setCounter] = React.useState(0);
  const {theme, fontsize} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const {id, title}: {id: number; title: string} = route.params;
  const {setHelp, help, setCurrentStep} = React.useContext(HelpContext);
  let isHelp = help === HelpScreen.QUESTIONS_SCREEN;
  React.useEffect(() => {
    (async () => {
      setTopic({
        id,
        title,
      });
      //get topic info
      const topic = await getTopicById(id);
      if (topic) {
        setTopic(topic);
        const questions: Question[] = await getQuestionsByTopic(topic.id);
        questions.forEach(function (element: Question) {
          element['selected'] = false;
        });
        setQuestions(questions);
        //get topic by id???˘
        const related: Topic[] = await getRelatedTopics(
          topic.ref_id as number,
          translations.LANG as Lang,
        );
        setRelated(related);
      }
    })();
  }, []);

  React.useEffect(() => {
    copilotEvents.on('stop', () => {
      setHelp(HelpScreen.NO_SCREEN);
    });

    copilotEvents.on('stepChange', (step: any) => setCurrentStep(step.order));

    if (isHelp) {
      //setting a function to handle the step change event
      //To start the step by step Walk through
      start();
    }
  }, [isHelp]);

  const onSubmit = (): void => {
    const newQuestions: Question[] = [];
    questions.forEach(function (element: Question) {
      element['selected'] && newQuestions.push(element);
    });
    navigation.navigate('Order', {
      questions: newQuestions,
      topic,
    });
  };

  const onSelect = (index: number): void => {
    let questionsCopy = [...questions];
    questionsCopy[index]['selected'] = !questionsCopy[index]['selected'];
    questionsCopy[index]['selected']
      ? setCounter(counter + 1)
      : setCounter(counter - 1);
    setQuestions(questionsCopy.slice());
  };

  return (
    <React.Fragment>
      <SearchBarHelp filter={filter} setFilter={setFilter} topic={topic} />
      <ScrollView
        style={[
          styles.DefaultContainer,
          {backgroundColor: getColor(theme, 'primaryBackground')},
        ]}>
        <View
          style={{
            backgroundColor: getColor(theme, 'primaryBackground'),
            flexDirection: 'column',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                styles.QuestionsPagetitle,
                {
                  color: getColor(theme, 'lightGray'),
                  fontSize: getFontSize(fontsize, 'fontSmall'),
                },
              ]}>
              {translations.SOURCE_TOPICS + '  '}
            </Text>
            <Text
              style={[
                styles.QuestionsPagesource,
                {
                  color: getColor(theme, 'lightGray'),
                  fontSize: getFontSize(fontsize, 'fontSmall'),
                },
              ]}>
              {topic.source}
            </Text>
          </View>
          <View style={[styles.QuestionsPagerelatedContainer]}>
            <Text
              style={[
                styles.QuestionsPagetitle,
                {
                  color: getColor(theme, 'lightGray'),
                  fontSize: getFontSize(fontsize, 'fontSmall'),
                },
              ]}>
              {translations.RELATED_TOPICS + ' '}
            </Text>
            {related.map((related: Topic) => (
              <TouchableOpacity
                key={related.id}
                onPress={() => {
                  navigation.push('Questions', {
                    screen: 'QuestionsScreen',
                    params: {
                      id: related.id,
                      title: related.title,
                    },
                  });
                }}>
                <Text
                  style={[
                    styles.QuestionsPagerelatedText,
                    {
                      color: getColor(theme, 'primaryOrange'),
                      fontSize: getFontSize(fontsize, 'fontSmall'),
                    },
                  ]}>
                  {related.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                styles.QuestionsPagetitle,
                {
                  color: getColor(theme, 'lightGray'),
                  fontSize: getFontSize(fontsize, 'fontSmall'),
                },
              ]}>
              {translations.LEVEL_TOPICS + ' '}
            </Text>
            <Text
              style={[
                styles.QuestionsPagesource,
                {
                  color: getTopicLevelColor(topic.level),
                  fontSize: getFontSize(fontsize, 'fontSmall'),
                },
              ]}>
              {getTopicLevelLabel(topic.level)}
            </Text>
          </View>
        </View>

        {isHelp && <ListItemHelp />}
        {questions.map((item: Question, i) => {
          if (item.title.toLowerCase().includes(filter.toLowerCase())) {
            return (
              <ListItem
                key={i}
                text={item.title}
                onSelect={() => onSelect(i)}
                selected={item.selected ? true : false}
              />
            );
          }
        })}
      </ScrollView>
      <ButtonQuestionsHelp
        counter={counter}
        isHelp={isHelp}
        onSubmit={onSubmit}
      />
    </React.Fragment>
  );
}
export default copilot({
  animated: true, // Can be true or false
  verticalOffset: 30, // <= this worked
  overlay: 'svg', // Can be either view or svg
  // color: 'orange',
  //borderRadius: 5,
  //arrowColor: 'red',
})(QuestionsPage as any);
