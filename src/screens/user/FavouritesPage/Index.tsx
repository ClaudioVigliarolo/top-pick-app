import * as React from 'react';
import {View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {copilot} from 'react-native-copilot';
import {Text} from 'native-base';
import {HelpScreen, Question} from '../../../interfaces/Interfaces';
import {getColor} from '../../../constants/theme/Themes';
import ListItemDrag from '../../../components/lists/ListItemDragFavourites';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {ThemeContext} from '../../../context/ThemeContext';
import {LocalizationContext} from '../../../context/LocalizationContext';
import {getFavourites, toggleLike} from '../../../utils/sql';
import styles from '../../../styles/styles';
import {getFontSize} from '../../../constants/theme/Fonts';
import {HelpContext} from '../../../context/HelpContext';
import {ListItemHelp} from './Help';
import {isFirstHelp, setFirstHelp} from '../../../utils/utils';
import {LAZY_LOAD_TIMEOUT} from '../../../constants/app/App';
import {StatusContext} from '../../../context/StatusContext';

interface FavouritesPageProps {
  copilotEvents: any;
  start: any;
  navigation: any;
}

function FavouritesPage({
  copilotEvents,
  navigation,
  start,
}: FavouritesPageProps) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const isFocused = useIsFocused();
  const {translations} = React.useContext(LocalizationContext);
  const {setSyncUserContent} = React.useContext(StatusContext);
  const {setHelp, help, setCurrentStep} = React.useContext(HelpContext);
  const [isCurrentPageHelp, setCurrentPageHelp] = React.useState<boolean>(
    false,
  );

  const {theme, fontsize} = React.useContext(ThemeContext);
  React.useEffect(() => {
    (async () => {
      await getItems();
      setTimeout(async () => {
        setLoading(false);
      }, LAZY_LOAD_TIMEOUT);
    })();
  }, [isFocused]);

  React.useEffect(() => {
    (async () => {
      if (
        (questions.length > 0 && help === HelpScreen.FAVOURITES_SCREEN) ||
        (await isFirstHelp(HelpScreen.FAVOURITES_SCREEN))
      ) {
        setCurrentPageHelp(true);
      }
    })();
  }, [help, questions.length]);

  React.useEffect(() => {
    copilotEvents.on('stop', () => {
      setHelp(HelpScreen.NO_SCREEN);
      setCurrentPageHelp(false);
      setFirstHelp(HelpScreen.FAVOURITES_SCREEN);
    });
    copilotEvents.on('stepChange', (step: any) => setCurrentStep(step.order));
    if (isCurrentPageHelp) {
      start();
    }
  }, [isCurrentPageHelp]);

  const getItems = async () => {
    const questions: Question[] = await getFavourites();
    setQuestions([...questions]);
  };

  const onRemove = async (id: number) => {
    const newItems = [...questions];
    const index = questions.findIndex((item) => item.id == id);
    const newVal = questions[index].liked ? 0 : 1;
    if (await toggleLike(id, questions[index].topic_id, newVal)) {
      setSyncUserContent(false);
      const index = newItems.findIndex((item) => item.id === id);
      newItems.splice(index, 1);
      setQuestions(newItems.slice());
    }
  };

  const renderItem = ({
    item,
    index,
    drag,
    isActive,
  }: RenderItemParams<Question>) => {
    return (
      <ListItemDrag
        isActive={isActive}
        onRemove={() => onRemove(item.id)}
        onDrag={drag}
        text={item.title}
        liked={item.liked ? true : false}
        id={item.id}
      />
    );
  };

  return (
    <View
      style={[
        styles.DefaultContainerCenter,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      {isCurrentPageHelp && <ListItemHelp />}
      {questions.length == 0 && !loading && !isCurrentPageHelp && (
        <Text
          style={[
            styles.FavouritesPageText,
            {
              color: getColor(theme, 'primaryOrange'),
              fontSize: getFontSize(fontsize, 'fontMed'),
            },
          ]}>
          {translations.NO_LIKED_QUESTIONS}
        </Text>
      )}
      {questions.length > 0 && (
        <DraggableFlatList
          data={questions}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.id}`}
          onDragEnd={({data}) => setQuestions(data)}
        />
      )}
    </View>
  );
}

export default copilot({
  animated: true, // Can be true or false
  verticalOffset: 30, // <= this worked
  overlay: 'svg', // Can be either view or svg
})(FavouritesPage as any);
