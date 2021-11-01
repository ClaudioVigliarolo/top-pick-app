import React from 'react';
import Bar from '../bars/Bar';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import IconAdd from 'react-native-vector-icons/Ionicons';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import translations from '../../context/translations';
import {ICON_CANCEL_BAR, ICON_MED} from '../../constants/theme/Dimensions';

interface AddBarProps {
  onAdd: (text: string) => void;
}

const MIN_QUESTION_LEN = 5;
const AddBar = ({onAdd}: AddBarProps) => {
  const [text, setText] = React.useState('');
  const {theme} = React.useContext(ThemeContext);

  const onAddCheck = () => {
    if (text.length < MIN_QUESTION_LEN) return false;
    onAdd(text);
    setText('');
  };

  return (
    <Bar
      LeftIcon={
        <IconAdd
          onPress={onAddCheck}
          name="add"
          size={ICON_MED}
          style={{paddingLeft: 10}}
          color={getColor(theme, 'searchIconColor')}
        />
      }
      RightIcon={
        <IconBack
          name="cancel"
          color={getColor(theme, 'searchIconColor')}
          size={ICON_CANCEL_BAR}
          style={{padding: 5}}
          onPress={() => setText('')}
        />
      }
      automatic={true}
      onSubmitEditing={onAddCheck}
      setText={setText}
      placeholder={translations.ADD_YOUR_QUESTION}
      text={text}
    />
  );
};
export default AddBar;
