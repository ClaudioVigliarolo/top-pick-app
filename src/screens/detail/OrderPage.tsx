import React, {useCallback} from 'react';
import {View, Platform, PermissionsAndroid, Alert} from 'react-native';
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
import ButtonsDownToUp from '../../components/buttons/ButtonsDownToUp';
import AddBar from '../../components/bars/AddBar';
import RNHTMLtoPDF, {Pdf} from 'react-native-html-to-pdf';
import EditOverlay from '../../components/overlays/EditOverlay';
import {hashCode} from '../../utils/utils';
import {addQuestion, toggleLike, updateQuestion} from '../../utils/sql';

const getQuestionHtml = (items: Question[], title: string, lang: Lang) => {
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
            ${items
              .map((item: Question) => ' <li>' + item.title + '</li>')
              .join('\n')}
          </ol> 
        </div>
    </body>
  </html>
`;
  return htmlContent;
};

export default function OrderPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const {
    questions,
    topic,
  }: {questions: Question[]; topic: Topic} = route.params;
  const [questionText, setQuestionText] = React.useState('');
  const [questionId, setQuestionId] = React.useState<number>(-1);
  const [items, setItems] = React.useState<Question[]>([]);
  const [isMenuOptionShown, showMenuOption] = React.useState<boolean>(false);
  const [isEditing, setEditing] = React.useState<boolean>(false);
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  let actionSheet = React.useRef<any>();

  React.useEffect(() => {
    setItems(questions);
  }, [questions]);

  const onRemove = (id: number) => {
    const newItems = [...items];
    const index = newItems.findIndex((item) => item.id == id);
    if (index != -1) newItems.splice(index, 1);
    setItems(newItems.slice());
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
        onEdit={onEdit}
        onRemove={onRemove}
        onDrag={drag}
        number={(index as number) + 1}
        text={item.title}
        isActive={isActive}
        liked={item.liked}
        onToggleLike={onToggleLike}
        id={item.id}
        backgroundColor={getColor(theme, 'primaryBackground')}
        opacity={isActive ? 0.7 : 1}
      />
    );
  };

  const onEditFinish = (editedQuestion: string, questionId: number) => {
    const newItems = [...items];
    const index = newItems.findIndex((item) => item.id == questionId);
    if (index != -1) {
      newItems[index].title = editedQuestion;
      //update question in db
      if (updateQuestion(questionId, editedQuestion)) {
        setItems(newItems.slice());
      }
    }
  };

  //, user_modified = ${newVal ? 1 : 0}
  const onQuestionAdd = () => {
    const id = hashCode(questionText);

    if (addQuestion(id, topic.id, questionText, translations.LANG as Lang)) {
      const newQuestionItem: Question = {
        id,
        topic_id: topic.id,
        liked: false,
        selected: false,
        title: questionText,
      };
      const newArray = [newQuestionItem].concat(items);
      setItems(newArray.slice());
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
    let itemsCopy = [...items];
    const index = items.findIndex((item) => item.id == id);
    const newVal = !items[index].liked;
    if (toggleLike(id, newVal)) {
      items[index].liked = newVal;
      setItems(itemsCopy.slice());
    }
  };

  const ButtonsDownToUpData: string[] = [
    translations.EXPORT_TO_PDF,
    translations.START_PRESENTATION,
    translations.CLOSE,
  ];

  const goPresentation = (): void => {
    navigation.navigate('Presentation', {
      questions: items,
      topic,
    });
  };

  const handleButtons = (functionName: string): void => {
    switch (functionName) {
      case translations.EXPORT_TO_PDF:
        createPDF(
          getQuestionHtml(items, topic.title, translations.LANG as Lang),
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
      <AddBar
        placeholder={translations.ADD_YOUR_QUESTION}
        setText={setQuestionText}
        text={questionText}
        onAdd={onQuestionAdd}
      />
      <DraggableFlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.id}`}
        onDragEnd={({data}) => setItems(data)}
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
