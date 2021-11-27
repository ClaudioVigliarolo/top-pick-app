import React from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import styles from '../../../styles/styles';

interface LibraryItem {
  title: string;
  description: string;
  image: ImageSourcePropType;
  imageSize?: number;
  destination: string;
  navigation: any;
}
export default function LibraryItem({
  title,
  description,
  image,
  imageSize = 30,
  navigation,
  destination,
}: LibraryItem) {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(destination);
        }}
        activeOpacity={0.9}
        style={{
          width: '80%',
          marginBottom: 30,
        }}>
        <View style={styles.LibraryItemContainer}>
          <View style={styles.LibraryItemHeaderContainer}>
            <Text style={styles.LibraryItemHeader}>{title}</Text>
            <Text style={styles.LibraryItemSubHeader}>{description}</Text>
          </View>
          <View style={styles.LibraryItemIconContainer}>
            <Image
              fadeDuration={5}
              resizeMode="center"
              style={{width: imageSize, height: imageSize}}
              source={image}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
