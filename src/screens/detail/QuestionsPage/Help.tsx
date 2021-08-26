import * as React from 'react';
import {View, Text} from 'react-native';
import {CopilotStep, walkthroughable} from 'react-native-copilot';
import {ThemeContext} from '../../../context/ThemeContext';
import {getColor} from '../../../constants/theme/Themes';
import CheckBox from '@react-native-community/checkbox';
import {ListItem as ListItemBase} from 'native-base';
import BottomButton from '../../../components/buttons/ButtonQuestions';
import SearchBar from '../../../components/bars/SearchBar';
import Dimensions from '../../../constants/theme/Dimensions';
import styles from '../../../styles/styles';
import {getFontSize} from '../../../constants/theme/Fonts';
import {HelpContext} from '../../../context/HelpContext';
import translations from '../../../context/translations';
import {Topic} from '../../../interfaces/Interfaces';

const WalkthroughableView = walkthroughable(View);

export const SearchBarHelp = ({
  filter,
  setFilter,
  topic,
}: {
  filter: string;
  setFilter: (text: string) => void;
  topic: Topic;
}) => (
  <CopilotStep text="You can filter the questions here" order={1} name="one">
    <WalkthroughableView>
      <SearchBar
        setText={(val: string) => {
          setFilter(val);
        }}
        text={filter}
        placeholder={translations.SEARCH_IN + ' ' + topic.title}
        automatic={false}
      />
    </WalkthroughableView>
  </CopilotStep>
);

export const ListItemHelp = () => {
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
            I am a beautiful question
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

export const ButtonQuestionsHelp = ({
  counter,
  isHelp,
  onSubmit,
}: {
  counter: number;
  isHelp: boolean;
  onSubmit: any;
}) => (
  <CopilotStep
    text="When you selected the questions you like, move on to the next section"
    order={4}
    name="four">
    <WalkthroughableView
      style={{
        maxHeight: counter > 0 || isHelp ? Dimensions.ButtonQuestionsHeight : 0,
      }}>
      <BottomButton
        onPress={onSubmit}
        text={translations.NEXT}
        isTextEnabled={counter > 0 || isHelp}
        secondaryText={translations.SELECTED + ' ' + counter}
        isButtonEnabled={counter > 0 || isHelp}
        visible={counter > 0 || isHelp}
      />
    </WalkthroughableView>
  </CopilotStep>
);
