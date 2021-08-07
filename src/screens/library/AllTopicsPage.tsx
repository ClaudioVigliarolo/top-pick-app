import * as React from 'react';
import {View} from 'react-native';
import {Lang, Section} from '../../interfaces/Interfaces';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import {getAllTopics} from '../../utils/sql';
import styles from '../../styles/styles';
import SectionList from '../../components/lists/SectionList';
import CONSTANTS from '../../constants/app/App';
import {validLetters} from '../../utils/validLetters';

export default function AllTopicsPage({navigation}: {navigation: any}) {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);
  const [data, setData] = React.useState<Section[]>([]);
  const sectionListRef = React.useRef<any>(null);

  React.useEffect(() => {
    (async () => {
      setTimeout(async () => {
        let indexChar = 0;
        const complete: Section[] = [];
        const tempList: Section = {
          data: [],
          title: 'a',
        };
        const ALL = await getAllTopics(translations.LANG as Lang);
        ALL.forEach((el) => {
          if (
            indexChar < validLetters.length - 1 &&
            el.title.charAt(0) !== validLetters[indexChar]
          ) {
            //insert up to now
            complete.push({...tempList});
            //until you are not finding a match
            indexChar++;
            while (
              indexChar < validLetters.length - 1 &&
              el.title.charAt(0) !== validLetters[indexChar]
            ) {
              //insert empty
              complete.push({
                data: [],
                title: validLetters[indexChar],
              });
              indexChar++;
            }
            tempList.title = validLetters[indexChar];
            tempList.data = [];
          }
          tempList.data.push({
            title: el.title,
            id: el.id,
          });
        });

        complete.push({...tempList});
        //for remaining letters
        while (indexChar < validLetters.length - 1) {
          //insert empty
          complete.push({
            data: [],
            title: validLetters[indexChar],
          });
          indexChar++;
        }
        setData(complete);
      }, CONSTANTS.LAZY_LOAD_TIMEOUT);
    })();
  }, [translations.LANG]);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <View
        style={[
          styles.DefaultContainer,
          {
            backgroundColor: getColor(theme, 'primaryBackground'),
          },
        ]}>
        <SectionList
          navigation={navigation}
          items={data}
          sectionListRef={sectionListRef}
        />
      </View>
    </View>
  );
}
