import * as React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {Category} from '../../interfaces/Interfaces';
import {getColor} from '../../constants/theme/Themes';
import ListItem from '../../components/lists/ListItemCheckbox';
import styles from '../../styles/styles';
import ButtonQuestions from '../buttons/ButtonQuestions';
import BackIcon from '../icons/BackIcon';
import translations from '../../context/translations';

interface QuestionsPageProps {
  title: string;
  subTitle: string;
  categories: Category[];
  onSubmit: (categories: Category[]) => void;
  minSelected: number;
  goBack: () => void;
}

function InterestsForm({
  categories,
  subTitle,
  title,
  onSubmit,
  minSelected,
  goBack,
}: QuestionsPageProps) {
  const [categoriesState, setCategoriesState] = React.useState<Category[]>([]);
  const {theme} = React.useContext(ThemeContext);
  let counter = categoriesState.filter((c) => c.selected).length;
  React.useEffect(() => {
    setCategoriesState(categories);
  }, [categories]);

  const onSelect = (index: number): void => {
    const newCategories = [...categoriesState];
    newCategories[index]['selected'] = !newCategories[index]['selected'];
    setCategoriesState(newCategories.slice());
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
        ]}>
        <View>
          <Text
            style={[
              styles.header,
              {
                color: getColor(theme, 'primaryOrange'),
                marginTop: 50,
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
            flexWrap: 'wrap',
            flexDirection: 'row',
            flex: 1,
            alignSelf: 'center',
          }}>
          {categories.map((c: Category, i: number) => (
            <View
              style={{
                flex: 1,
                minWidth: 120,
                maxWidth: 150,
                marginRight: 20,
                marginLeft: 20,
              }}>
              <ListItem
                key={c.id}
                id={c.id}
                text={c.title}
                onSelect={() => onSelect(i)}
                selected={c.selected ? true : false}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <ButtonQuestions
        onPress={() => {
          onSubmit(categoriesState);
        }}
        text={translations.NEXT}
        isTextEnabled={counter >= minSelected}
        secondaryText={translations.SELECTED + ' ' + counter}
        isButtonEnabled={counter >= minSelected}
        visible={counter >= minSelected}
      />
    </React.Fragment>
  );
}
export default InterestsForm;
