import React from 'react';
import {
  View,
  Platform,
  PermissionsAndroid,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {Lang, Question, Topic} from '../../interfaces/Interfaces';
import {getColor} from '../../constants/theme/Themes';
import {LocalizationContext} from '../../context/LocalizationContext';
import FileViewer from 'react-native-file-viewer';
import BottomButton from '../../components/buttons/BottomButtons';
import {ThemeContext} from '../../context/ThemeContext';
import ListItemDrag from '../../components/lists/ListItemDrag';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {copilot, CopilotStep, walkthroughable} from 'react-native-copilot';
import ButtonsDownToUp from '../../components/buttons/ButtonsDownToUp';
import AddBar from '../../components/bars/AddBar';
import RNHTMLtoPDF, {Pdf} from 'react-native-html-to-pdf';
import EditOverlay from '../../components/overlays/EditOverlay';
import {hashCode} from '../../utils/utils';
import {addQuestion, toggleLike, updateQuestion} from '../../utils/sql';
import CONSTANTS from '../../constants/app/App';
import translations from '../../context/translations';
import {HelpContext} from '../../context/HelpContext';
import {ListItem as ListItemBase} from 'native-base';
import {getFontSize} from '../../constants/theme/Fonts';
import styles from '../../styles/styles';
import DragIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LikeIcon from 'react-native-vector-icons/AntDesign';
import Dimensions from '../../constants/theme/Dimensions';
const AddBarWrapper = (props: any) => (
  <View {...props.copilot}>
    <AddBar
      placeholder={translations.ADD_YOUR_QUESTION}
      setText={props.text}
      text={props.text}
      onAdd={props.onQuestionAdd}
    />
  </View>
);

const ListItemWrapper = () => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  return (
    <ListItemBase
      noIndent={true}
      noBorder={true}
      style={[styles.ListItemDragcontainer, {backgroundColor: 'yellow'}]}>
      <View>
        <Text
          style={{
            color: getColor(theme, 'primaryText'),
            textAlignVertical: 'center',
            fontWeight: 'bold',
            fontSize: getFontSize(fontsize, 'fontSmall'),
          }}>
          19
        </Text>
      </View>
      <TouchableWithoutFeedback>
        <View style={{alignSelf: 'flex-start'}}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              textAlignVertical: 'center',
              textAlign: 'left',
              fontSize: getFontSize(fontsize, 'fontSmall'),
            }}>
            cia
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.ListItemDragiconContainer}>
        <LikeIcon
          name={true ? 'heart' : 'hearto'}
          color={getColor(theme, 'primaryOrange')}
          size={Dimensions.iconMedSmall}
          onPress={() => {}}
          style={{
            marginRight: 10,
            marginLeft: Platform.OS === 'ios' ? 10 : 0,
          }}
        />
        <TouchableWithoutFeedback onPressIn={() => {}}>
          <DragIcon
            name="drag"
            color={getColor(theme, 'lightGray')}
            size={Dimensions.iconMed}
          />
        </TouchableWithoutFeedback>
      </View>
    </ListItemBase>
  );
};

const getQuestionHtml = (questions: Question[], title: string, lang: Lang) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang=${lang}>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pdf Topic</title>
        <style>
            body {
                font-size: 16px;
                color: black;
            }
            h3 {
                text-align: center;
              font-weight:fold;
            }
            li{
                padding:8px;
            }
        </style>
    </head>
    <body>
        <h3 style="text-transform: uppercase" >${title}</h3>
        <div style="margin-top:50px">
          <ol>
            ${questions
              .map((item: Question) => ' <li>' + item.title + '</li>')
              .join('\n')}
          </ol> 
        </div>
    </body>
  </html>
`;
  return htmlContent;
};

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
  const {translations} = React.useContext(LocalizationContext);
  const {setHelp, isHelp, setCurrentStep} = React.useContext(HelpContext);
  let actionSheet = React.useRef<any>();

  React.useEffect(() => {
    setQuestions(route.params.questions);
  }, [route.params.questions]);

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

  const onRemove = (id: number) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex((item) => item.id == id);
    if (index != -1) newQuestions.splice(index, 1);
    setQuestions(newQuestions.slice());
  };

  const onEdit = (id: number, newText: string) => {
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
        onDrag={drag}
        number={(index as number) + 1}
        text={item.title}
        isActive={isActive}
        liked={item.liked}
        onToggleLike={() => onToggleLike(item.id)}
        id={item.id}
        backgroundColor={getColor(theme, 'primaryBackground')}
        opacity={isActive ? 0.7 : 1}
      />
    );
  };

  const onEditFinish = (editedQuestion: string, questionId: number) => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex((item) => item.id == questionId);
    if (index != -1) {
      newQuestions[index].title = editedQuestion;
      //update question in db
      if (updateQuestion(questionId, editedQuestion)) {
        setQuestions(newQuestions.slice());
      }
    }
  };

  //, user_modified = ${newVal ? 1 : 0}
  const onQuestionAdd = async () => {
    const id = hashCode(questionText);
    if (
      await addQuestion(
        id,
        topic.id,
        questionText,
        CONSTANTS.USER_QUESTION_PRIORITY_N,
        translations.LANG as Lang,
      )
    ) {
      const newQuestionItem: Question = {
        id,
        topic_id: topic.id,
        liked: false,
        selected: false,
        title: questionText,
      };
      setQuestions((oldQuestions) => [newQuestionItem, ...oldQuestions]);
    }
  };

  const createPDF = async (htmlContent: string) => {
    if (await isPermitted()) {
      let options = {
        //Content to print
        html: htmlContent,
        //File Name
        fileName: topic.title,
        //File directory
        directory: 'Top Picks',
      };
      let file: Pdf = await RNHTMLtoPDF.convert(options);
      if (file.filePath)
        FileViewer.open(file.filePath).catch((error) => {
          console.log('error opening');
        });
    }
  };

  const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const onToggleLike = (id: number) => {
    let itemsCopy = [...questions];
    const index = questions.findIndex((item) => item.id == id);
    const newVal = !questions[index].liked;
    if (toggleLike(id, newVal)) {
      questions[index].liked = newVal;
      setQuestions(itemsCopy.slice());
    }
  };

  const ButtonsDownToUpData: string[] = [
    translations.EXPORT_TO_PDF,
    translations.START_PRESENTATION,
    translations.CLOSE,
  ];

  const goPresentation = (): void => {
    navigation.navigate('Presentation', {
      questions: questions,
      topic,
    });
  };

  const handleButtons = (functionName: string): void => {
    switch (functionName) {
      case translations.EXPORT_TO_PDF:
        createPDF(
          getQuestionHtml(questions, topic.title, translations.LANG as Lang),
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
      <CopilotStep text="You can add new questions here" order={1} name="one">
        <AddBarWrapper
          text={questionText}
          setText={setQuestionText}
          topic={topic}
        />
      </CopilotStep>
      {true && <ListItemWrapper />}
      <DraggableFlatList
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.id}`}
        onDragEnd={({data}) => setQuestions(data)}
      />
      {/*showMenuOption(true)*/}
      <BottomButton
        onPress={() => {
          actionSheet.current.show();
        }}
        text={translations.READY_TO_TALK}
        isButtonEnabled={true}
        isTextEnabled={false}
        visible={true}
      />
      <ButtonsDownToUp
        data={ButtonsDownToUpData}
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
      <EditOverlay
        onChangeText={setQuestionText}
        text={questionText}
        onSubmit={() => {
          setEditing(false);
          setQuestionText('');
          onEditFinish(questionText, questionId);
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

export default copilot({
  animated: true, // Can be true or false
  verticalOffset: 30, // <= this worked
  overlay: 'svg', // Can be either view or svg
  // color: 'orange',
  //borderRadius: 5,
  //arrowColor: 'red',
})(OrderPage as any);
