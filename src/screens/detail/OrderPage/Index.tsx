import React from 'react';
import {Alert, View} from 'react-native';
import {
  HelpScreen,
  Lang,
  Question,
  Topic,
} from '../../../interfaces/Interfaces';
import {getColor} from '../../../constants/theme/Themes';
import {LocalizationContext} from '../../../context/LocalizationContext';
import {ThemeContext} from '../../../context/ThemeContext';
import ListItemDrag from '../../../components/lists/ListItemDragArrange';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {copilot} from 'react-native-copilot';
import EditOverlay from '../../../components/overlays/EditOverlay';
import {
  addQuestion,
  toggleLike,
  updateQuestion,
} from '../../../utils/storage/sql';
import {HelpContext} from '../../../context/HelpContext';
import {AddBarHelp, BottomButtonHelp, ListItemHelp} from './Help';
import {ActionButtonLabels, createPDF, getHtmlTemplate} from './utils';
import {
  hashCode,
  isFirstHelp,
  setFirstHelp,
} from '../../../utils/storage/storage';
import {
  COPILOT_OPTIONS,
  USER_QUESTION_PRIORITY_N,
} from '../../../constants/app/App';
import ActionButtons from '../../../components/buttons/ActionButtons';
import {StatusContext} from '../../../context/StatusContext';
import {AuthContext} from '../../../context/AuthContext';
import translations from '../../../context/translations';
interface OrderPageProps {
  copilotEvents: any;
  start: any;
  route: any;
  navigation: any;
}
function OrderPage({copilotEvents, navigation, route, start}: OrderPageProps) {
  const {topic}: {topic: Topic} = route.params;
  const [questionText, setQuestionText] = React.useState('');
  const [questionId, setQuestionId] = React.useState<number>(-1);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [isMenuOptionShown, showMenuOption] = React.useState<boolean>(false);
  const [isEditing, setEditing] = React.useState<boolean>(false);
  const {theme} = React.useContext(ThemeContext);
  const {contentLanguage} = React.useContext(LocalizationContext);
  const {setHelp, help, setCurrentStep} = React.useContext(HelpContext);
  const {user} = React.useContext(AuthContext);

  const {setSyncUserContent, setRequiredAuthFunctionality} = React.useContext(
    StatusContext,
  );

  const [isCurrentPageHelp, setCurrentPageHelp] = React.useState<boolean>(
    false,
  );

  let actionSheet = React.useRef<any>();

  React.useEffect(() => {
    setQuestions(route.params.questions);
  }, [route.params.questions]);

  React.useEffect(() => {
    copilotEvents.on('stop', () => {
      setHelp(HelpScreen.NO_SCREEN);
      setCurrentPageHelp(false);
      setFirstHelp(HelpScreen.ORDER_SCREEN);
    });
    copilotEvents.on('stepChange', (step: any) => setCurrentStep(step.order));
    if (isCurrentPageHelp) {
      start();
    }
  }, [isCurrentPageHelp]);

  React.useEffect(() => {
    (async () => {
      if (
        help === HelpScreen.ORDER_SCREEN ||
        (await isFirstHelp(HelpScreen.ORDER_SCREEN))
      ) {
        setCurrentPageHelp(true);
      }
    })();
  }, [help]);

  const onRemove = (id: number) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex((item) => item.id == id);
    if (index != -1) newQuestions.splice(index, 1);
    setQuestions(newQuestions.slice());
  };

  const onEdit = (id: number, newText: string) => {
    if (!user) {
      setRequiredAuthFunctionality(true);
      return;
    }
    setEditing(true);
    setQuestionText(newText);
    setQuestionId(id);
  };

  const renderItem = ({
    item,
    index,
    drag,
    isActive,
  }: RenderItemParams<Question>) => {
    return (
      <ListItemDrag
        onEdit={() => onEdit(item.id, item.title)}
        onRemove={() => onRemove(item.id)}
        isActive={isActive}
        onDrag={drag}
        number={(index as number) + 1}
        text={item.title}
        liked={item.liked as number}
        onToggleLike={() => onToggleLike(item.id)}
        id={item.id}
      />
    );
  };

  const onEditFinish = async (editedQuestion: string, questionId: number) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex((item) => item.id == questionId);
    if (index != -1) {
      newQuestions[index].title = editedQuestion;
      //update question in db
      if (
        await updateQuestion(
          questionId,
          newQuestions[index].topic_id,
          editedQuestion,
        )
      ) {
        setSyncUserContent(false);
        setQuestions(newQuestions.slice());
      }
    }
  };

  const onToggleLike = async (id: number) => {
    if (!user) {
      setRequiredAuthFunctionality(true);
      return;
    }
    let itemsCopy = [...questions];
    const index = questions.findIndex((item) => item.id == id);
    const newVal = questions[index].liked ? 0 : 1;
    if (await toggleLike(id, questions[index].topic_id, newVal)) {
      setSyncUserContent(false);
      questions[index].liked = newVal;
      setQuestions(itemsCopy.slice());
    }
  };

  const goPresentation = (): void => {
    navigation.navigate('Presentation', {
      questions: questions,
      topic,
    });
  };

  const onQuestionAdd = async (questionText: string) => {
    if (!user) {
      setRequiredAuthFunctionality(true);
      return;
    }
    const id = hashCode(questionText);
    if (
      await addQuestion(
        id,
        topic.id,
        questionText,
        USER_QUESTION_PRIORITY_N,
        contentLanguage,
      )
    ) {
      setSyncUserContent(false);
      const newQuestionItem: Question = {
        id,
        topic_id: topic.id,
        liked: 1,
        selected: false,
        title: questionText,
      };
      setQuestions((oldQuestions) => [newQuestionItem, ...oldQuestions]);
    }
  };

  const handleButtons = (functionName: string): void => {
    switch (functionName) {
      case translations.EXPORT_TO_PDF:
        createPDF(
          topic.title,
          getHtmlTemplate(questions, topic.title, contentLanguage),
        );
        break;

      case translations.START_PRESENTATION:
        goPresentation();
        break;
      case translations.CLOSE:
      // actionSheet.current.hide();
      default:
        break;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: getColor(theme, 'primaryBackground'),
      }}>
      <AddBarHelp onAdd={onQuestionAdd} />
      {isCurrentPageHelp && <ListItemHelp />}
      <DraggableFlatList
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.id}`}
        onDragEnd={({data}) => setQuestions(data)}
      />

      <ActionButtons
        data={ActionButtonLabels}
        isActive={isMenuOptionShown}
        actionSheet={actionSheet}
        backgroundColor={getColor(theme, 'primaryBackground')}
        color={getColor(theme, 'primaryOrange')}
        onPress={(functionName: string) => {
          showMenuOption(false);
          handleButtons(functionName);
        }}
        title={translations.IS_TIME}
        onHide={() => actionSheet.current.hide()}
      />

      <BottomButtonHelp
        onPress={() => {
          actionSheet.current.show();
        }}
      />

      <EditOverlay
        initialText={questionText}
        onSubmit={(newText: string) => {
          setEditing(false);
          setQuestionText('');
          onEditFinish(newText, questionId);
        }}
        onClose={() => {
          setEditing(false);
          setQuestionText('');
        }}
        isVisible={isEditing}
      />
    </View>
  );
}

export default copilot(COPILOT_OPTIONS)(OrderPage as any);
