import {Section, Topic} from '../interfaces/Interfaces';

export const validLetters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '#',
];

export const sectionTopicListSort = (topics: Topic[]) => {
  let indexChar = 0;
  const complete: Section[] = [];
  const tempList: Section = {
    data: [],
    title: 'a',
  };
  topics.forEach((el) => {
    if (
      indexChar < validLetters.length - 1 &&
      el.title.charAt(0).toLowerCase() !== validLetters[indexChar]
    ) {
      //insert up to now
      if (tempList.data.length > 0) complete.push({...tempList});
      //until you are not finding a match
      indexChar++;
      while (
        indexChar < validLetters.length - 1 &&
        el.title.charAt(0).toLowerCase() !== validLetters[indexChar]
      ) {
        //insert empty
        /*complete.push({
          data: [],
          title: validLetters[indexChar],
        });*/
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

  if (tempList.data.length > 0) complete.push({...tempList});
  //for remaining letters
  while (indexChar < validLetters.length - 1) {
    //insert empty
    /*complete.push({
      data: [],
      title: validLetters[indexChar],
    });*/
    indexChar++;
  }

  return complete;
};
