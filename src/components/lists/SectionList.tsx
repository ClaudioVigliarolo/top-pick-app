import React from 'react';
import {Text, SafeAreaView, SectionList, PixelRatio} from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import styles from '../../styles/styles';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import {getFontSize} from '../../constants/theme/Fonts';

interface CustomSectionListState {}

interface CustomSectionListProps {
  items: any;
  sectionListRef: any;
  renderItem: any;
}

export default class CustomSectionList extends React.PureComponent<
  CustomSectionListProps,
  CustomSectionListState
> {
  constructor(props: any) {
    super(props);
    //@ts-ignore
    this.getItemLayout = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex, rowIndex) =>
        sectionIndex === 0 ? 100 : 50,

      // These three properties are optional
      getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
      getSectionHeaderHeight: () => 20, // The height of your section headers
      getSectionFooterHeight: () => 10, // The height of your section footers
    });
  }
  static contextType = ThemeContext;
  renderSectionHeader = ({section}: {section: any}) => {
    return (
      <Text
        style={[
          styles.sectionListHeader,
          {
            backgroundColor: getColor(this.context.theme, 'sectionHeader'),
            fontSize: getFontSize(this.context.theme, 'fontBigMed'),
          },
        ]}>
        {section.title}
      </Text>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.sectionListContainer}>
        <SectionList
          initialNumToRender={20}
          keyExtractor={(item) => item.id + ''}
          sections={this.props.items}
          stickySectionHeadersEnabled={true}
          ref={this.props.sectionListRef}
          maxToRenderPerBatch={80}
          renderItem={this.props.renderItem}
          renderSectionHeader={this.renderSectionHeader}
        />
      </SafeAreaView>
    );
  }
}
