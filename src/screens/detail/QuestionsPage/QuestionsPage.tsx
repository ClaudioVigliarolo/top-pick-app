import * as React from 'react';
import {View, ScrollView, Text, TouchableOpacity, Alert} from 'react-native';
import {copilot} from 'react-native-copilot';
import {useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../../../context/ThemeContext';
import {HelpScreen, Question, Topic} from '../../../interfaces/Interfaces';
import {getColor} from '../../../constants/theme/Themes';
import ListItem from '../../../components/lists/ListItemCheckbox';
import styles from '../../../styles/styles';
import {isFirstHelp, setFirstHelp} from '../../../utils/storage/storage';
import {HelpContext} from '../../../context/HelpContext';
import {ListItemHelp, ButtonQuestionsHelp, SearchBarHelp} from './Help';
import {COPILOT_OPTIONS} from '../../../constants/app/App';
import {
  getTopicLevelColor,
  getTopicLevelLabel,
} from '../../../utils/utils/utils';
import {getFontSize} from '../../../constants/theme/Fonts';
import Expandable from '../../../components/misc/Expandable';
import translations from '../../../context/translations';

interface QuestionsPageProps {
  copilotEvents: any;
  start: any;
  questions: Question[];
  related: Topic[];
  topic: Topic;
  onSelect: (index: number) => void;
}

function QuestionsPage({
  copilotEvents,
  start,
  questions,
  topic,
  onSelect,
  related,
}: QuestionsPageProps) {
  const navigation: any = useNavigation();
  const [filter, setFilter] = React.useState('');
  const {theme, fontsize} = React.useContext(ThemeContext);

  const {setHelp, help, setCurrentStep} = React.useContext(HelpContext);
  const [isCurrentPageHelp, setCurrentPageHelp] = React.useState<boolean>(
    false,
  );
  let counter = questions.filter((q) => q.selected).length;

  React.useEffect(() => {
    (async () => {
      if (
        help === HelpScreen.QUESTIONS_SCREEN ||
        (await isFirstHelp(HelpScreen.QUESTIONS_SCREEN))
      ) {
        setCurrentPageHelp(true);
      }
    })();
  }, [help]);

  React.useEffect(() => {
    copilotEvents.on('stop', () => {
      setHelp(HelpScreen.NO_SCREEN);
      setCurrentPageHelp(false);
      setFirstHelp(HelpScreen.QUESTIONS_SCREEN);
    });

    copilotEvents.on('stepChange', (step: any) => setCurrentStep(step.order));

    if (isCurrentPageHelp) {
      //setting a function to handle the step change event
      //To start the step by step Walk through
      start();
    }
  }, [isCurrentPageHelp]);

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
                },
              ]}>
              {translations.SOURCE_TOPICS + '  '}
            </Text>
            <Text
              style={[
                styles.QuestionsPagesource,
                {
                  color: getColor(theme, 'lightGray'),
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
                },
              ]}>
              {translations.LEVEL_TOPICS + ' '}
            </Text>
            <Text
              style={[
                styles.QuestionsPagesource,
                {
                  color: getTopicLevelColor(topic.level),
                },
              ]}>
              {getTopicLevelLabel(topic.level)}
            </Text>
          </View>
          <View>
            <View>
              <Expandable
                children={
                  <>
                    <Text
                      style={[
                        styles.QuestionsPagetitle,
                        {
                          color: getColor(theme, 'lightGray'),
                        },
                      ]}>
                      {'Description:'}
                    </Text>
                    <Text
                      style={[
                        styles.QuestionsPageDescription,
                        {
                          color: getColor(theme, 'primaryText'),
                        },
                      ]}>
                      {topic.description}
                    </Text>
                  </>
                }
              />
            </View>
          </View>
        </View>

        {isCurrentPageHelp && <ListItemHelp />}
        {questions.map((item: Question, i: number) => {
          if (item.title.toLowerCase().includes(filter.toLowerCase())) {
            return (
              <ListItem
                key={item.id}
                id={item.id}
                fontSize={getFontSize(fontsize, 'fontSmallMed')}
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
        isHelp={isCurrentPageHelp}
        onSubmit={onSubmit}
      />
    </React.Fragment>
  );
}
export default copilot(COPILOT_OPTIONS)(QuestionsPage as any);
