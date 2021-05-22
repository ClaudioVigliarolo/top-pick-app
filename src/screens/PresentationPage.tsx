import * as React from 'react';
import {View} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {Question, Topic} from '../interfaces/Interfaces';
import {getColor} from '../constants/theme/Themes';
import Slider from '../components/custom/Slider';

export default function PresentationPage({
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
  const {theme} = React.useContext(ThemeContext);
  return (
    <View style={{flex: 1}}>
      <Slider
        backgroundColor={getColor(theme, 'primaryOrange')}
        title={topic.title}
        items={questions}
        image={null}
        onClose={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
}
