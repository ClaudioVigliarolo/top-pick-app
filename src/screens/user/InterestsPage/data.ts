//posso tenermi per ogni topic se appartiene a una di queste. Lo posso fare a partire dalle categorie.
/*
I use topPick for:

Learning a new language
Talking with friends
Finding ideas for essays

*/

import {
  FormBasic,
  FormCategories,
  FormName,
  FormType,
  Level,
  Option,
  TopicLevel,
  UserGoal,
} from '../../../interfaces/Interfaces';

/*
I am a student
I am a worker


*/
/*

Interests

I like sports, outdoor activities


With TopPick you can personalize your experience. We will ask you some questions 

va ristrutturato. Start button. con introduzione.You already filled your informations. Click here to update your decision.
*/

export const formGoal: FormBasic = {
  title: 'I use TopPick for:',
  subTitle: 'we will adapt your experience according to your goals',
  name: FormName.FORM_GOALS,
  options: [
    {
      selected: false,
      title: 'Learning a new language',
      id: UserGoal.LANGUAGE,
      next: FormName.FORM_LEVELS,
    },
    {
      selected: false,
      title: 'Talking with friends',
      id: UserGoal.FRIENDS,
      next: FormName.FORM_INTERESTS,
    },
    {
      selected: false,
      title: 'Finding ideas for essays',
      id: UserGoal.ESSAYS,
      next: FormName.FORM_INTERESTS,
    },
    {
      selected: false,
      title: 'Something else',
      id: UserGoal.OTHER,
      next: FormName.FORM_INTERESTS,
    },
  ],
};

export const formLevels: FormBasic = {
  title: 'What is your current level in your target language?',
  subTitle: 'we will show you the topics proportionate to your level',
  name: FormName.FORM_LEVELS,
  options: [
    {
      selected: false,
      title: 'Advanced Level (C1-C2)',
      id: TopicLevel.HARD,
      next: FormName.FORM_INTERESTS,
    },
    {
      selected: false,
      title: 'Intermediate Level (B1-B2)',
      id: TopicLevel.MEDIUM,
      next: FormName.FORM_INTERESTS,
    },
    {
      selected: false,
      title: 'Beginner Level (A1-A2)',
      id: TopicLevel.EASY,
      next: FormName.FORM_INTERESTS,
    },

    {
      selected: false,
      title: 'All Levels',
      id: TopicLevel.IGNORE,
      next: FormName.FORM_INTERESTS,
    },
  ],
};

export const formInterests: FormCategories = {
  title: 'Select Your Interests:',
  subTitle: 'You need to select at least 5 categories',
  name: FormName.FORM_INTERESTS,
  categories: [],
};

export const getForm = (formName: FormName): FormCategories | FormBasic => {
  switch (formName) {
    case FormName.FORM_GOALS:
      return formGoal;
    case FormName.FORM_INTERESTS:
      return formInterests;
    case FormName.FORM_LEVELS:
      return formLevels;
    //should never come here
    default:
      return formGoal;
  }
};
