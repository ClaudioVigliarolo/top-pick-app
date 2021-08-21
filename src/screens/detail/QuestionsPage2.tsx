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
import {copilot, CopilotStep, walkthroughable} from 'react-native-copilot';
import {
  getQuestionsByTopic,
  getRelatedTopics,
  getTopicById,
} from '../../utils/sql';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';
import {getTopicLevelColor, getTopicLevelLabel} from '../../utils/utils';

const WalkthroughableText = walkthroughable(Text);
const handleStepChange = (step) => {
  //Handler, in case we want to handle the step change
  console.log(`Current step is: ${step.name}`);
};

interface QuestionsPageProps {
  copilotEvents: any;
  start: any;
}

const QuestionsPage = (props: QuestionsPageProps) => {
  React.useEffect(() => {
    //setting a function to handle the step change event
    props.copilotEvents.on('stepChange', handleStepChange);
    //To start the step by step Walk through
    props.start();
  }, []);
  return (
    <CopilotStep
      text="This is the heading with my cazzo"
      order={1}
      name="firstUniqueKey">
      <WalkthroughableText>AAAaaaaaaa</WalkthroughableText>
    </CopilotStep>
  );
};
export default copilot({
  animated: true, // Can be true or false
  overlay: 'svg', // Can be either view or svg
})(QuestionsPage as any);
