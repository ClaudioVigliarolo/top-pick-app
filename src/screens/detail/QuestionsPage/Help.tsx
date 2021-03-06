import * as React from 'react';
import {View, Text} from 'react-native';
import {CopilotStep, walkthroughable} from 'react-native-copilot';
import {ThemeContext} from '../../../context/ThemeContext';
import {getColor} from '../../../constants/theme/Themes';
import CheckBox from '@react-native-community/checkbox';
import {ListItem as ListItemBase} from 'native-base';
import ButtonQuestions from '../../../components/buttons/ButtonQuestions';
import SearchBar from '../../../components/bars/SearchBar';
import styles from '../../../styles/styles';
import {getFontSize} from '../../../constants/theme/Fonts';
import {HelpContext} from '../../../context/HelpContext';
import translations from '../../../context/translations';
import {Topic} from '../../../interfaces/Interfaces';
import {BUTTON_QUESTIONS_HEIGTH} from '../../../constants/theme/Dimensions';

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
  <CopilotStep text={translations.HELP_QUESTIONS_SCREEN_1} order={1} name="one">
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
    <ListItemBase
      style={[
        styles.ListItemcontainer,
        {flexDirection: 'row', justifyContent: 'space-between'},
      ]}
      noBorder={true}>
      <CopilotStep
        text={translations.HELP_QUESTIONS_SCREEN_2}
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
        text={translations.HELP_QUESTIONS_SCREEN_3}
        order={3}
        name="three">
        <WalkthroughableView>
          <CheckBox
            tintColors={{
              true: getColor(theme, 'primaryOrange'),
              false: getColor(theme, 'lightGray'),
            }}
            style={{marginLeft: '6%'}}
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
    text={translations.HELP_QUESTIONS_SCREEN_4}
    order={4}
    name="four">
    <WalkthroughableView
      style={{
        maxHeight: counter > 0 || isHelp ? BUTTON_QUESTIONS_HEIGTH : 0,
      }}>
      <ButtonQuestions
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
