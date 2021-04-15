import LocalizedStrings from 'localized-strings';

// the translations
// (tip: move them in separate JSON files and import them)
export const DEFAULT_LANGUAGE = 'en';

const translations = {
  it: {
    TOP_PICK: 'Top Pick',
    PICK_TOPIC: 'Pick Topic',
    EXPORT_TO_PDF: 'Esporta come PDF',
    START_PRESENTATION: 'Inizia Presentazione',
    LANGUAGE_SELECT: 'Cambia Lingua',
    CATEGORIES: 'Categorie',
    FAVOURITES: 'Preferite',
    SETTINGS: 'Impostazioni',
    SEARCH: 'Ricerca',
    QUESTIONS: 'Domande',
    NO_LIKED_QUESTIONS: 'Nessuna Domanda Preferita',
    ARRANGE_QUESTIONS: 'Ordina le Domande',
    IS_TIME: "E' ora di iniziare",
    ADD_YOUR_QUESTION: 'Aggiungi Una Domanda',
    NEXT: 'Continua',
    SOURCE_TOPICS: 'fonte:',
    UPDATING_QUESTIONS: 'Stiamo aggiornando le domande...',
    SELECTED: 'Selezionati',
    POPULAR_SEARCHES: 'Ricerche più popolari',
    READY_TO_TALK: 'Sono Pronto',
    SEARCH_A_TOPIC: 'Cerca un Topic',
    SEARCH_IN: 'Cerca in',
    WELCOME_TOPICK_TITLE: 'Benvenuto su Top Pick!',
    WELCOME_TOPICK_DESCRIPTION:
      "Questa è un breve guida per iniziare ad usare l'app",
    LANG: 'it',
    DARK_MODE: 'Tema Scuro',
    LIGHT_MODE: 'Tema Chiaro',
    START: 'Iniziamo!',
    STEP_1_TITLE: 'Step 1: Scegli',
    STEP_1_DESCRIPTION: 'Premi su una carta per selezionare il topic',
    SELECT_LANGUAGE: 'Seleziona lingua',
    CHANGE_THEME: 'Cambia tema',
    STEP_2_TITLE: 'Step 2: Seleziona',
    STEP_2_DESCRIPTION:
      'Seleziona le domande che preferisci cliccando sul quadratino a destra',
    AUTOMATIC_UPDATE: 'Update Automatico',
    STEP_3_TITLE: 'Step 3: Riordina',
    STEP_3_DESCRIPTION:
      "Metti in ordine le domande che hai scelto trascinando l'icona a destra",
    READY_TO_START: 'Siamo pronti ad iniziare!',
    WAIT_UPDATE: 'Attendi che i topic si aggiornino',
    READY_TO_START_TIP:
      'TIP: Puoi rivedere questo mini tutorial in ogni momento dalla sezione Impostazioni',
    EDIT: 'edita',
    SELECT: 'seleziona',
    REPORT: 'segnala',
    COPY: 'copia',
    DESELECT: 'deseleziona',
    CLOSE: 'chiudi',
    REMOVE: 'rimuovi',
    REMOVE_FAVOURITE: 'non mi piace',
    ADD_FAVOURITE: 'Mi piace',
    GREEN: 'verde',
    BLUE: 'blu',
    RED: 'rosso',
    ORANGE: 'arancio',
    VIOLET: 'viola',
    DEFAULT: 'default',
    RELATED_TOPICS: 'sugg:',
    REASON_TRANSLATION: 'cattiva traduzione',
    REASON_PERTINENCE: 'non pertinente',
    REASON_SCURRILOUS: 'linguaggio scurrile',
    REASON_OTHERS: 'altro',
    TOPICS_SYNCRONIZED: 'Tutti i topic sono aggiornati!',
    UPDATE_REQUIRED_TITLE: 'Top Pick',
    UPDATE_REQUIRED_MESSAGE:
      "E'necessario scaricare i contenuti per usare l'app",
    DOWNLOAD: 'Download',
    CANCEL: 'Chiudi',
  },
  en: {
    TOP_PICK: 'Top Pick',
    PICK_TOPIC: 'Pick Topic',
    EXPORT_TO_PDF: 'Export to PDF',
    START_PRESENTATION: 'Start Presentation',
    START: 'Start!',
    READY: "I'm Ready! ",
    IS_TIME: 'Now Is The Time',
    ADD_YOUR_QUESTION: 'Add Your Question',
    NEXT: 'Next',
    DARK_MODE: 'Dark Mode',
    LIGHT_MODE: 'Light Mode',
    SOURCE_TOPICS: 'source:',
    RELATED_TOPICS: 'related:',
    SELECTED: 'Selected',
    POPULAR_SEARCHES: 'Popular Searches',
    LANGUAGE_SELECT: 'Change Language',
    SEARCH_A_TOPIC: 'Search a Topic',
    CATEGORIES: 'Categories',
    FAVOURITES: 'Favourites',
    SETTINGS: 'Settings',
    SELECT_LANGUAGE: 'Select Language',
    SEARCH: 'Search',
    QUESTIONS: 'Questions',
    CHANGE_THEME: 'Change Theme',
    SEARCH_IN: 'Search in',
    ARRANGE_QUESTIONS: 'Arrange Questions',
    LANG: 'en',
    READY_TO_TALK: 'Ready To Talk',
    NO_LIKED_QUESTIONS: 'No Liked Questions',
    AUTOMATIC_UPDATE: 'Automatic Update',
    WELCOME_TOPICK_TITLE: 'Welcome to Top Pick!',
    WELCOME_TOPICK_DESCRIPTION:
      'Here’s a quick guide to show you how to use the app',
    STEP_1_TITLE: 'Step 1: Choose',
    STEP_1_DESCRIPTION: 'Simply press on the card to select the topic',
    UPDATING_QUESTIONS: 'updating questions...',
    STEP_2_TITLE: 'Step 2: Select',
    STEP_2_DESCRIPTION:
      'You can Select the questions you like by pressing the little square on the right',
    WAIT_UPDATE: 'Wait while the topics are updating',
    STEP_3_TITLE: 'Step 3: Arrange',
    STEP_3_DESCRIPTION:
      'You can put the questions in the order you prefer by dragging the icon on the right',
    READY_TO_START: 'We are all ready!',
    READY_TO_START_TIP:
      'TIP: You can rewatch this tutorial in the settings folder',
    CLOSE: 'Close',
    EDIT: 'edit',
    COPY: 'copy',
    SELECT: 'select',
    REPORT: 'report',
    DESELECT: 'deselect',
    REMOVE: 'remove',
    REMOVE_FAVOURITE: 'Unlike',
    ADD_FAVOURITE: 'Like',
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    ORANGE: 'orange',
    VIOLET: 'violet',
    DEFAULT: 'default',
    REASON_TRANSLATION: 'bad translation',
    REASON_PERTINENCE: 'not pertinenet',
    REASON_SCURRILOUS: 'rough language',
    REASON_OTHERS: 'something else',
    TOPICS_SYNCRONIZED: 'All The topics are syncronized!',
    UPDATE_REQUIRED_TITLE: 'Top Pick',
    UPDATE_REQUIRED_MESSAGE: ' You need to upload the topics to use the app',
    DOWNLOAD: 'Download',
    CANCEL: 'Cancel',
  },
};

export default new LocalizedStrings(translations);
