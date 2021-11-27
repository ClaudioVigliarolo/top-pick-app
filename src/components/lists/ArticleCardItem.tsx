import React from 'react';
import RNUrlPreview from 'react-native-url-preview';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Left,
  Body,
} from 'native-base';
import {View} from 'native-base';

interface ArticleCardItemProps {
  questionTitle: string;
  questionN: number;
  questionUrl: string;
  questionDescription: string;
}
export default function ArticleCardItem({
  questionTitle,
  questionN,
  questionUrl,
  questionDescription,
}: ArticleCardItemProps) {
  return (
    <View style={{margin: 2}}>
      <Card style={{backgroundColor: 'red'}}>
        <CardItem>
          <Left>
            <Body>
              <Text note>Question {questionN}:</Text>
              <Text style={{fontWeight: '700'}}>{questionTitle}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <RNUrlPreview text={'any text to be parsed , ' + questionUrl} />
            <Text style={{marginTop: 20}}>{questionDescription}</Text>
          </Body>
        </CardItem>
      </Card>
    </View>
  );
}
