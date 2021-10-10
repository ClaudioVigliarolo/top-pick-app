import {Platform, StyleSheet} from 'react-native';
import Dimensions from '../constants/theme/Dimensions';
import {staticFontSizes} from '../constants/theme/Fonts';

export default StyleSheet.create({
  buttomButtonsContainer: {
    height: Dimensions.ButtonQuestionsHeight,
    width: '100%',
    borderTopWidth: 2,
    padding: 10,
  },

  buttomButtonsContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },

  ButtonQuestionsText: {
    textAlign: 'center',
  },

  buttomButtonsBottomContainer: {
    flex: 1.2,
    justifyContent: 'center',
    maxWidth: '75%',
  },

  ButtonsSearchContainer: {
    flex: 1,
    padding: 5,
  },
  ButtonsSearchHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  ButtonsSearchButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  TabBarContainer: {
    height: Dimensions.tabHeight,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },

  CustomDrawerHeader: {
    borderBottomWidth: 0,
    height: 100,
  },

  CustomDrawerListItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  CustomDrawerListItemText: {
    paddingRight: 20,
  },

  CustomDrawerfooterText: {
    color: '#fff',
    marginLeft: 20,
    fontSize: staticFontSizes.fontSmaller,
    textTransform: 'uppercase',
    fontWeight: Platform.OS == 'ios' ? '500' : '300',
  },

  CustomDrawerFooterContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  CustomDrawerheader: {
    borderBottomWidth: 0,
    height: 100,
  },
  CustomDrawerheaderText: {
    color: '#fff',
    paddingRight: 5,
    fontSize: staticFontSizes.fontMed,
  },

  CustomDrawerSignInText: {
    color: '#fff',
    fontSize: staticFontSizes.fontSmallMed,
    textTransform: 'uppercase',
  },

  CustomDrawerSyncText: {
    color: '#fff',
    fontSize: staticFontSizes.fontSmallMed,
    textTransform: 'uppercase',
    marginTop: 10,
  },

  CustomDrawerUsername: {
    color: '#fff',
    fontSize: staticFontSizes.fontSmallMed,
    textTransform: 'uppercase',
    width: 150,
  },

  ListItemDragcontainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'red',
    position: 'relative',
  },
  ListItemDragHelpcontainer: {
    flex: 1,
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'blue',
  },

  ListItemDragtextContainer: {
    flex: 7,
    flexDirection: 'row',
    height: '100%',
    // backgroundColor: 'violet',
    textAlign: 'left',
    paddingLeft: 8,
    paddingRight: 8,
  },
  ListItemDragnumberContainer: {
    position: 'absolute',
    left: 10,
    //backgroundColor: 'green',
  },

  ListItemDragIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    // backgroundColor: 'orange',
  },

  ListItemDragmodalItem: {
    justifyContent: 'flex-start',
    padding: 10,
    paddingLeft: 20,
  },
  ListItemDragmodalItemContainer: {
    backgroundColor: 'white',
    borderRadius: 2,
    alignSelf: 'center',
    width: Dimensions.MODAL_WIDTH,
  },
  ListItemDragmodalText: {
    alignSelf: 'baseline',
    fontWeight: Platform.OS == 'ios' ? '500' : '100',
    textTransform: 'capitalize',
  },
  ListItemDragmodalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },

  ListItemcontainer: {
    flex: 1,
    position: 'relative',
  },
  ListItemCheckBoxmodalItem: {
    justifyContent: 'flex-start',
    padding: 10,
    paddingLeft: 20,
  },
  ListItemCheckBoxmodalItemContainer: {
    backgroundColor: 'white',
    borderRadius: 2,
    alignSelf: 'center',
    opacity: 0.9,
    padding: 2,
    width: Dimensions.MODAL_WIDTH,
  },
  ListItemCheckBoxmodalText: {
    alignSelf: 'baseline',
    textTransform: 'capitalize',
  },
  ListItemCheckBoxmodalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },

  ListItemCheckBoxtextContainer: {
    maxWidth: '82%',
  },

  ListItemBasicSecondaryText: {
    position: 'absolute',
    right: '20%',
    textTransform: 'capitalize',
  },

  ListItemBasicPrimaryText: {
    textTransform: 'capitalize',
  },

  FavouritesPageText: {
    textAlign: 'center',
  },
  DefaultContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  DefaultContainerCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  CustomButtonContainer: {
    position: 'relative',
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: 'darkorange',
    //used in case of flex
    alignItems: 'center',
    justifyContent: 'center',
  },

  absoluteCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  CustomButtonbuttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '500' : '900',
    textTransform: 'uppercase',
    padding: Platform.OS === 'ios' ? 10 : 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },

  CustomCarouselContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'dodgerblue',
  },
  CustomCarouselitemLabel: {
    color: 'white',
  },

  EditOverlaycontainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
  },
  EditOverlayCloseIcon: {
    color: '#fff',
    position: 'absolute',
    right: '2%',
    top: '5%',
    opacity: 0.7,
  },
  EditOverlayediting: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxHeight: 200,
  },
  EditOverlaytextInput: {
    padding: 10,
  },
  EditOverlayheader: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },

  Sliderwrapper: {
    flex: 1,
    paddingTop: '20%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    textAlignVertical: 'center',
  },
  Slidertitle: {
    textAlign: 'center',
    fontWeight: Platform.OS == 'ios' ? '500' : '100',
    marginTop: '2%',
    textTransform: 'uppercase',
    color: '#fff',
  },
  Sliderquestion: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  Sliderheader: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  Sliderparagraph: {
    fontSize: 17,
  },
  SliderpaginationWrapper: {
    position: 'absolute',
    bottom: '15%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  SliderpaginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: '#fff',
    marginLeft: 10,
  },
  SlidertitleSection: {
    height: '8%',
    width: '100%',
  },

  SliderContainer: {
    flex: 1,
    position: 'relative',
  },

  QuestionsPagecounter: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    position: 'absolute',
    top: -50,
    zIndex: 1000,
  },
  QuestionsPagerelatedText: {
    textAlign: 'left',
    paddingLeft: 10,
    paddingTop: 5,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
  QuestionsPagetitle: {
    textAlign: 'left',
    paddingLeft: '3%',
    paddingTop: 5,
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  QuestionsPagesource: {
    textAlign: 'left',
    paddingLeft: '3%',
    paddingTop: 5,
    textTransform: 'uppercase',
  },
  QuestionsPagerelatedContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1,
    paddingRight: '2%',
  },

  SliderimageStyle: {
    height: '50%',
    width: '100%',
  },

  StartSliderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    width: '80%',
    alignSelf: 'center',
  },

  StartSliderheader: {
    fontWeight: 'bold',
    marginBottom: '5%',
    textAlign: 'center',
    color: '#fff',
  },
  StartSliderlastSlideHeader: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  StartSliderparagraph: {
    textAlign: 'center',
    color: '#fff',
  },

  StartSliderlastSlide: {
    flex: 1,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },

  StartSliderSkipButton: {
    color: 'white',
    fontStyle: 'italic',
  },

  StartSliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionListContainer: {
    flex: 1,
    paddingTop: 10,
    marginHorizontal: 16,
    width: '95%',
  },

  sectionListHeader: {
    padding: 4,
    borderRadius: 3,
    paddingLeft: 10,
    textTransform: 'capitalize',
    color: '#fff',
    width: '90%',
  },

  signInButton: {
    width: 250,
    height: 50,
    alignSelf: 'center',
  },

  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'orange',
  },

  authContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    height: 500,
  },

  marginSmall: {
    marginTop: 20,
    marginBottom: 20,
  },

  changeAuthText: {
    textAlign: 'center',
    fontSize: staticFontSizes.fontSmallMed,
  },

  errorText: {
    color: 'orangered',
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    textAlign: 'center',
  },
});
