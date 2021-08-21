import * as React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {copilot, CopilotStep, walkthroughable} from 'react-native-copilot';
import {ThemeContext} from '../../context/ThemeContext';
import {Lang, Question, Topic} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import {getColor} from '../../constants/theme/Themes';
import ListItem from '../../components/lists/ListItemCheckbox';
import CheckBox from '@react-native-community/checkbox';

import {ListItem as ListItemBase} from 'native-base';
import BottomButton from '../../components/buttons/BottomButtons';
import SearchBar from '../../components/bars/SearchBar';
import Dimensions from '../../constants/theme/Dimensions';
import {
  getQuestionsByTopic,
  getRelatedTopics,
  getTopicById,
} from '../../utils/sql';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';
import {getTopicLevelColor, getTopicLevelLabel} from '../../utils/utils';
import {HelpContext} from '../../context/HelpContext';
import translations from '../../context/translations';
import {Right} from 'native-base';

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);

const SearchBarWrapper = (props: any) => (
  <View {...props.copilot}>
    <SearchBar
      setText={(val: string) => {
        props.setFilter(val);
      }}
      text={props.filter}
      placeholder={translations.SEARCH_IN + ' ' + props.topic.title}
      automatic={false}
    />
  </View>
);

const ListItemWrapper = () => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  const {currentStep} = React.useContext(HelpContext);

  return (
    <ListItemBase style={styles.ListItemHelpcontainer} noBorder={true}>
      <CopilotStep
        text="Press the question to copy the text"
        order={2}
        name="two">
        <WalkthroughableView style={styles.ListItemCheckBoxtextContainer}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              fontSize: getFontSize(fontsize, 'fontSmall'),
            }}>
            "I am a beautiful question"
          </Text>
        </WalkthroughableView>
      </CopilotStep>
      <CopilotStep
        text="Press the checkbox to select the question"
        order={3}
        name="three">
        <WalkthroughableView>
          <CheckBox
            tintColors={{
              true: getColor(theme, 'primaryOrange'),
              false: getColor(theme, 'lightGray'),
            }}
            onFillColor={getColor(theme, 'primaryOrange')}
            onTintColor={getColor(theme, 'checkOrange')}
            tintColor={getColor(theme, 'lightGray')}
            onCheckColor={getColor(theme, 'white')}
            value={currentStep > 2}
            onValueChange={() => {}}
          />
        </WalkthroughableView>
      </CopilotStep>
    </ListItemBase>
  );
};

const BottomButtonWrapper = ({
  copilot,
  counter,
  isHelp,
  onSubmit,
}: {
  copilot?: Object;
  counter: number;
  isHelp: boolean;
  onSubmit: any;
}) => (
  <View
    {...copilot}
    style={{
      maxHeight: counter > 0 || isHelp ? Dimensions.bottomButtonsHeight : 0,
    }}>
    <BottomButton
      onPress={onSubmit}
      text={translations.NEXT}
      isTextEnabled={counter > 0 || isHelp}
      secondaryText={translations.SELECTED + ' ' + counter}
      isButtonEnabled={counter > 0 || isHelp}
      visible={counter > 0 || isHelp}
    />
  </View>
);

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
  const {setHelp, isHelp, setCurrentStep} = React.useContext(HelpContext);

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
      setHelp(false);
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

  const onValChange = (index: number): void => {
    let questionsCopy = [...questions];
    questionsCopy[index]['selected'] = !questionsCopy[index]['selected'];
    questionsCopy[index]['selected']
      ? setCounter(counter + 1)
      : setCounter(counter - 1);
    setQuestions(questionsCopy.slice());
  };

  return (
    <React.Fragment>
      <CopilotStep
        text="You can filter the questions here"
        order={1}
        name="one">
        <SearchBarWrapper filter={filter} setFilter={setFilter} topic={topic} />
      </CopilotStep>

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

        {isHelp && <ListItemWrapper />}
        {questions.map((item: Question, i) => {
          if (item.title.toLowerCase().includes(filter.toLowerCase())) {
            return (
              <ListItem
                key={i}
                editable={true}
                text={item.title}
                id={item.id}
                topic={topic.title}
                onValChange={(newVal: boolean) => onValChange(i)}
                value={item.selected ? true : false}
              />
            );
          }
        })}
      </ScrollView>
      <CopilotStep
        text="When you selected the questions you like, move on to the next section"
        order={4}
        name="four">
        <BottomButtonWrapper
          counter={counter}
          isHelp={isHelp}
          onSubmit={onSubmit}
        />
      </CopilotStep>
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
