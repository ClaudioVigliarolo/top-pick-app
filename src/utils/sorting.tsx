import translations from '../context/translations';
import {TopicSection, Topic} from '../interfaces/Interfaces';

enum Dates {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  LAST_WEEK = 'LAST_WEEK',
  LAST_MONTH = 'LAST_MONTH',
  LAST_THREE_MONTHS = 'LAST_THREE_MONTHS',
  LAST_YEAR = 'LAST_YEAR',
  MORE_THAN_YEAR = 'MORE_THAN_YEAR',
}
const datesArr = [
  Dates.TODAY,
  Dates.YESTERDAY,
  Dates.LAST_WEEK,
  Dates.LAST_MONTH,
  Dates.LAST_THREE_MONTHS,
  Dates.LAST_YEAR,
  Dates.MORE_THAN_YEAR,
];
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

export const alphabeticalSectionSort = (topics: Topic[]) => {
  let indexChar = 0;
  const complete: TopicSection[] = [];
  const tempList: TopicSection = {
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
    indexChar++;
  }

  return complete;
};

function isDateInWeek(timestamp: Date) {
  const todayObj = new Date();
  const todayDate = todayObj.getDate();
  const todayDay = todayObj.getDay();

  // get first date of week
  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

  // get last date of week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  // if date is equal or within the first and last dates of the week
  return (
    new Date(timestamp) >= firstDayOfWeek &&
    new Date(timestamp) <= lastDayOfWeek
  );
}

export const isDateInRange = (comp: Date, value: Dates): boolean => {
  let dateToCheck = new Date(comp);
  var currDate = new Date();
  switch (value) {
    case Dates.TODAY:
      const isToday = dateToCheck.toDateString() === currDate.toDateString();
      return isToday;

    case Dates.YESTERDAY:
      currDate.setDate(currDate.getDate() - 1);
      const isYesterday =
        dateToCheck.toDateString() === currDate.toDateString();
      return isYesterday;

    case Dates.LAST_WEEK:
      return isDateInWeek(comp);

    case Dates.LAST_MONTH:
      currDate.setMonth(currDate.getMonth() - 1);
      const isLastMonth = dateToCheck > currDate; //currDate.getFullYear() === dateToCheck.getFullYear() &&  currDate.getMonth() === dateToCheck.getMonth();
      return isLastMonth;

    case Dates.LAST_THREE_MONTHS:
      currDate.setMonth(currDate.getMonth() - 3);
      const isLastThreeMonths = dateToCheck > currDate;
      return isLastThreeMonths;

    case Dates.LAST_YEAR:
      currDate.setFullYear(currDate.getFullYear() - 1);
      const isLastYear = dateToCheck > currDate;
      return isLastYear;

    case Dates.MORE_THAN_YEAR:
      return true;

    default:
      return false;
  }
};

// call setHours to take the time out of the comparison

export const timeSectionSort = (topics: Topic[]) => {
  let indexArr = 0;
  console.log('innnnn!!!!', datesArr[0], translations[datesArr[0]]);
  const complete: TopicSection[] = [];
  const tempList: TopicSection = {
    data: [],
    title: translations[datesArr[0]],
  };
  topics.forEach((el) => {
    if (
      indexArr < datesArr.length - 1 &&
      !isDateInRange(el.timestamp as Date, datesArr[indexArr])
    ) {
      if (tempList.data.length > 0) complete.push({...tempList});

      while (
        indexArr < datesArr.length - 1 &&
        !isDateInRange(el.timestamp as Date, datesArr[indexArr])
      ) {
        indexArr++;
      }
      tempList.title = translations[datesArr[indexArr]];
      tempList.data = [];
    }

    tempList.data.push({
      title: el.title,
      id: el.id,
    });
  });
  if (tempList.data.length > 0) complete.push({...tempList});
  return complete;
};
