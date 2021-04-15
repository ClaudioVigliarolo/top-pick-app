import * as React from 'react';
import {StyleSheet, Alert, View, ScrollView} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Text} from 'native-base';
import {Question} from '../interfaces/Interfaces';
import {getColor} from '../constants/Themes';
import ListItemDrag from '../components/lists/ListItemDrag';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {ThemeContext} from '../context/ThemeContext';
import Dimensions from '../constants/Dimensions';
import {LocalizationContext} from '../context/LocalizationContext';
import {getDB} from '../utils/utils';

export default function CategoryList({navigation}: {navigation: any}) {
  const [items, setItems] = React.useState<Question[]>([]);
  const isFocused = useIsFocused();
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const {translations} = React.useContext(LocalizationContext);

  const {theme} = React.useContext(ThemeContext);
  React.useEffect(() => {
    getItems();
  }, [isFocused]); // Only re-run the effect if count changes

  const getItems = () => {
    getDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * from questions
         WHERE LANG = "${translations.LANG}"  AND liked = 1;`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let newArr = [];
          for (let i = 0; i < rows.length; i++) {
            newArr.push({
              ...rows.item(i),
            });
          }
          setItems([...newArr]);
          setLoading(false);
        },
      );
    });
  };

  const onRemove = (id: number) => {
    const newItems = [...items];
    const index = newItems.findIndex((item) => item.id == id);
    if (index != -1) newItems.splice(index, 1);
    setItems(newItems.slice());
  };

  const onDislike = (id: number) => {
    const index = items.findIndex((item) => item.id == id);
    const newVal = !items[index].liked;
    getDB().transaction((tx) => {
      tx.executeSql(
        `UPDATE "questions"
         SET liked = 0
         WHERE "id" = ${id}`,
        [],
        (tx, results) => {
          getItems();
        },
      );
    });
  };

  const renderItem = ({
    item,
    index,
    drag,
    isActive,
  }: {
    item: Question;
    index: number;
    drag: any;
    isActive: boolean;
  }) => {
    return (
      <ListItemDrag
        onRemove={onRemove}
        onDrag={drag}
        text={item.title}
        isActive={isActive}
        liked={item.liked}
        id={item.id}
        onToggleLike={onDislike}
        backgroundColor={getColor(theme, 'primaryBackground')}
        opacity={isActive ? 0.6 : 1}
      />
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: getColor(theme, 'primaryBackground'),
    },

    text: {
      color: getColor(theme, 'primaryOrange'),
      textAlign: 'center',
      fontSize: Dimensions.fontMed,
    },
  });
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: getColor(theme, 'primaryBackground'),
      }}>
      {!isLoading && items.length == 0 && (
        <Text style={styles.text}>{translations.NO_LIKED_QUESTIONS}</Text>
      )}
      {items.length > 0 && (
        <DraggableFlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.id}`}
          onDragEnd={({data}) => setItems(data)}
        />
      )}
    </View>
  );
}
