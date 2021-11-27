import * as React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import ListItem from '../lists/ListItemCheckbox';
import styles from '../../styles/styles';
import ButtonQuestions from '../buttons/ButtonQuestions';
import {Option} from '../../interfaces/Interfaces';
import BackIcon from '../icons/BackIcon';

interface QuestionsPageProps {
  title: string;
  subTitle: string;
  options: Option[];
  onSubmit: (options: Option[]) => void;
  multiple?: boolean;
  goBack: () => void;
}

function InterestsForm({
  options,
  subTitle,
  title,
  onSubmit,
  goBack,
  multiple = true,
}: QuestionsPageProps) {
  const [optionsState, setOptionsState] = React.useState<Option[]>([]);
  const {theme} = React.useContext(ThemeContext);
  React.useEffect(() => {
    setOptionsState(options);
  }, [options]);

  const onSelect = (index: number): void => {
    const newOptions = [...optionsState];
    newOptions[index]['selected'] = !newOptions[index]['selected'];
    if (!multiple) {
      newOptions.forEach((c, i) => {
        if (i !== index) c.selected = false;
      });
    }
    setOptionsState(newOptions.slice());
  };

  return (
    <React.Fragment>
      <BackIcon
        color={getColor(theme, 'primaryOrange')}
        onPress={goBack}
        left="3%"
        top="3%"
      />
      <ScrollView
        style={[
          styles.DefaultContainer,
          {backgroundColor: getColor(theme, 'primaryBackground')},
          {marginTop: 50, padding: 20},
        ]}>
        <View>
          <Text
            style={[
              styles.header,
              {
                color: getColor(theme, 'primaryOrange'),
              },
            ]}>
            {title}
          </Text>
          <Text
            style={[
              styles.subHeader,
              {
                color: getColor(theme, 'lightGrey'),
              },
            ]}>
            {subTitle}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            alignSelf: 'center',
          }}>
          {optionsState.map((o: Option, i: number) => (
            <View
              style={{
                flex: 1,
                minWidth: '80%',
              }}>
              <ListItem
                key={i}
                id={i}
                text={o.title}
                modal={false}
                onSelect={() => onSelect(i)}
                selected={o.selected}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <ButtonQuestions
        onPress={() => {
          onSubmit(optionsState);
        }}
        text={'Next'}
        isButtonEnabled={true}
        isTextEnabled={false}
        visible={optionsState.some((o) => o.selected)}
      />
    </React.Fragment>
  );
}
export default InterestsForm;
