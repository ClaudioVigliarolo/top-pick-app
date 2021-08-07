import * as React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {Lang, Question, Topic} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import {getColor} from '../../constants/theme/Themes';
import ListItem from '../../components/lists/ListItemCheckbox';
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

export default function QuestionsPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
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

  React.useEffect(() => {
    (async () => {
      //get topic info
      console.log('))))', id, title);
      const topic = await getTopicById(id);
      console.log('armone ', topic);
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
      <SearchBar
        setText={(val: string) => {
          setFilter(val);
        }}
        text={filter}
        placeholder={translations.SEARCH_IN + ' ' + topic.title}
        automatic={false}
      />
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
                    params: {topic: related},
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
        </View>
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

      <View
        style={{maxHeight: counter > 0 ? Dimensions.bottomButtonsHeight : 0}}>
        <BottomButton
          onPress={onSubmit}
          text={translations.NEXT}
          isTextEnabled={counter > 0}
          secondaryText={translations.SELECTED + ' ' + counter}
          isButtonEnabled={counter > 0}
          visible={counter > 0}
        />
      </View>
    </React.Fragment>
  );
}
