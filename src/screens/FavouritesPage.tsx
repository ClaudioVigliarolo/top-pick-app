import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Text} from 'native-base';
import {Lang, Question} from '../interfaces/Interfaces';
import {getColor} from '../constants/Themes';
import ListItemDrag from '../components/lists/ListItemDrag';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {ThemeContext} from '../context/ThemeContext';
import Dimensions from '../constants/Dimensions';
import {LocalizationContext} from '../context/LocalizationContext';
import {getFavourites, toggleLike} from '../utils/sql';

export default function CategoryList({navigation}: {navigation: any}) {
  const [items, setItems] = React.useState<Question[]>([]);
  const isFocused = useIsFocused();
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const {translations} = React.useContext(LocalizationContext);

  const {theme} = React.useContext(ThemeContext);
  React.useEffect(() => {
    getItems();
  }, [isFocused]);

  const getItems = async () => {
    const questions: Question[] = await getFavourites(
      translations.LANG as Lang,
    );
    setItems([...questions]);
  };

  const onRemove = (id: number) => {
    const newItems = [...items];
    const index = newItems.findIndex((item) => item.id == id);
    if (index != -1) newItems.splice(index, 1);
    setItems(newItems.slice());
  };

  const onDislike = (id: number) => {
    toggleLike(id, false);
    getItems();
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
