import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../Util/Color";
// get screens dimenstions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenWidthGrater = windowWidth > 1100

const styles = StyleSheet.create({
  container: {
    height: screenWidthGrater ? windowWidth / 20 : windowWidth / 10,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    paddingHorizontal: windowWidth * 0.032, // Adjust the percentage as needed
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: screenWidthGrater ? windowWidth * 0.02 : windowWidth * 0.04, // Adjust the percentage as needed
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: screenWidthGrater ? windowWidth * 0.012 : windowWidth * 0.014, // Adjust the percentage as needed
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: windowWidth / 10.8,
    height: windowHeight / 20,
    borderRadius: windowWidth / 21.6, // Adjust the percentage as needed
  },

})

export default styles;