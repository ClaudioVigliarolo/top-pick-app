import React from 'react';
import Bar from '../bars/Bar';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import IconAdd from 'react-native-vector-icons/Ionicons';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import Dimensions from '../../constants/theme/Dimensions';
import translations from '../../context/translations';

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
          size={Dimensions.iconMed}
          style={{paddingLeft: 10}}
          color={getColor(theme, 'searchIconColor')}
        />
      }
      RightIcon={
        <IconBack
          name="cancel"
          color={getColor(theme, 'searchIconColor')}
          size={Dimensions.iconCancelBar}
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
