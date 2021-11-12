import * as React from 'react';
import {LocalizationContext} from '../../../context/LocalizationContext';
import InterestsForm from '../../../components/forms/InterestsForm';
import {getCategories} from '../../../utils/sql';
import {
  Category,
  FormBasic,
  FormCategories,
  FormName,
  Lang,
  Option,
  TopicLevel,
  UserGoal,
  UserInterests,
} from '../../../interfaces/Interfaces';
import MultipleChoiceForm from '../../../components/forms/MultipleChoiceForm';
import {getForm} from './data';
import StartForm from './StartForm';
import EndForm from './EndForm';
import {setUserInterests} from '../../../utils/firebase';
import {AuthContext} from '../../../context/AuthContext';
import {getStorageInterests, loadInterests} from '../../../utils/storage';
import {useNavigation} from '@react-navigation/native';

const UserForm = () => {
  const [pagesHistory, setPagesHistory] = React.useState<
    (FormBasic | FormCategories)[]
  >([getForm(FormName.FORM_GOALS)]);
  const [start, setStart] = React.useState<boolean>(true);
  const [end, setEnd] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedGoals, setSelectedGoals] = React.useState<UserGoal[]>([]);
  const [selectedLevel, setSelectedLevel] = React.useState<TopicLevel>();
  const {translations} = React.useContext(LocalizationContext);
  const {user} = React.useContext(AuthContext);
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      /**load goal */

      const interests = await getStorageInterests();
      console.log('Mmmmmmmmmm', interests);

      if (interests) {
        //load goals
        setSelectedGoals(interests.goals);

        //load categories

        const categories = await getCategories(translations.LANG as Lang);
        categories.forEach(function (c: Category) {
          if (interests.categories_ref_id.includes(c.ref_id)) {
            c.selected = true;
          } else {
            c.selected = false;
          }
        });

        console.log('ddioopo', categories);
        setCategories(categories);
        //load level
        setSelectedLevel(interests.level);
      }
    })();
  }, []);

  const onSubmitInterests = (categories: Category[]) => {
    console.log('cccc', categories);
    setCategories(categories);
    const currentPages = [...pagesHistory];
    setEnd(true);
    setPagesHistory(currentPages);
    //end
    //const currentPages = [...pagesHistory];
    //currentPages.push(getForm(FormName.));
    //setPagesHistory(currentPages);
  };

  const onSubmitFormGoal = (options: Option[]) => {
    const selectedOptions = options.filter((op) => op.selected);
    const selectedGoals: UserGoal[] = selectedOptions.map((s) => s.id);
    if (selectedGoals) {
      setSelectedGoals(selectedGoals);
      const newPages = [...pagesHistory];
      if (selectedGoals.includes(UserGoal.LANGUAGE)) {
        newPages.push(getForm(FormName.FORM_LEVELS));
      } else {
        newPages.push(getForm(FormName.FORM_INTERESTS));
      }
      setPagesHistory(newPages);
    }
  };

  const onSubmitLevel = (options: Option[]) => {
    const selectedOption = options.find((op) => op.selected);
    if (selectedOption) {
      setSelectedLevel(selectedOption.id as TopicLevel);
      const newPages = [...pagesHistory];
      newPages.push(getForm(selectedOption.next));
      setPagesHistory(newPages);
    }
  };

  const onSubmitForm = async () => {
    const selectedCategories = categories.filter((c) => c.selected);
    const userInterests: UserInterests = {
      categories_ref_id: selectedCategories.map((s) => s.ref_id),
      goals: selectedGoals,
      level: selectedLevel ? selectedLevel : TopicLevel.IGNORE,
    };
    setLoading(true);
    if (user) {
      try {
        await setUserInterests(user, userInterests);
        navigation.navigate('Settings');
      } catch (error) {}
    }
    setLoading(false);
  };

  const goBackForm = () => {
    if (pagesHistory.length === 1) setStart(true);
    if (pagesHistory.length > 0) {
      const currentPages = [...pagesHistory];
      currentPages.pop();
      setPagesHistory(currentPages);
    }
  };

  const onStartForm = () => {
    setStart(false);
    setPagesHistory([getForm(FormName.FORM_GOALS)]);
  };

  const renderForm = (currentPage: FormBasic | FormCategories) => {
    if (currentPage.name === FormName.FORM_GOALS) {
      const goals = (currentPage as FormBasic).options;
      goals.forEach((g) => {
        if (selectedGoals.includes(g.id)) {
          g.selected = true;
        }
      });
      return (
        <MultipleChoiceForm
          goBack={goBackForm}
          subTitle={currentPage.subTitle}
          title={currentPage.title}
          options={goals}
          onSubmit={onSubmitFormGoal}
        />
      );
    }

    if (currentPage.name === FormName.FORM_LEVELS) {
      const levels = (currentPage as FormBasic).options;
      levels.forEach((l) => {
        if (l.id === selectedLevel) l.selected = true;
      });
      console.log('ciucc', levels);
      return (
        <MultipleChoiceForm
          goBack={goBackForm}
          subTitle={currentPage.subTitle}
          multiple={false}
          title={currentPage.title}
          options={levels}
          onSubmit={onSubmitLevel}
        />
      );
    }

    if (currentPage.name === FormName.FORM_INTERESTS) {
      return (
        <InterestsForm
          goBack={goBackForm}
          onSubmit={onSubmitInterests}
          minSelected={5}
          categories={categories}
          subTitle={currentPage.subTitle}
          title={currentPage.title}
        />
      );
    }
  };
  return (
    <>
      {start && (
        <StartForm newForm={selectedGoals.length === 0} onStart={onStartForm} />
      )}
      {end && (
        <EndForm
          onSubmit={onSubmitForm}
          loading={loading}
          goBack={() => {
            setEnd(false);
          }}
        />
      )}
      {!start &&
        !end &&
        pagesHistory.length > 0 &&
        renderForm(pagesHistory[pagesHistory.length - 1])}
    </>
  );
};

export default UserForm;
/*
 <InterestsForm
        onSubmit={onSubmitCategories}
        minSelected={5}
        categories={pages[0].categories}
        subTitle={pages[0].subTitle}
        title={pages[0].title}
      />
*/
