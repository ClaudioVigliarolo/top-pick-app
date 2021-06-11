import {Platform, StyleSheet} from 'react-native';
import Dimensions from '../constants/theme/Dimensions';
import {staticFontSizes} from '../constants/theme/Fonts';

export default StyleSheet.create({
  buttomButtonsContainer: {
    height: Dimensions.bottomButtonsHeight,
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

  bottomButtonsText: {
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

  ListItemDragcontainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ListItemDragtextContainer: {
    flex: 9,
    flexDirection: 'row',
    height: '100%',
    padding: 0,
    textAlign: 'left',
  },
  ListItemDragnumberContainer: {
    margin: 0,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: -15,
  },

  ListItemDragiconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 2,
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
    width: '100%',
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
    backgroundColor: 'darkorange',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },

  CustomButtonbuttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '500' : '900',
    textTransform: 'uppercase',
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
});
