import { StyleSheet, Dimensions, Platform } from 'react-native';
import Colors, { COLORS } from '../Util/Color';
const { width, height } = Dimensions.get('window');

// get screens dimensions 
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// change screen width 
const widthPercentageToDP = (widthPercent) => {
    return (widthPercent * screenWidth) / 100;
};
//   change screen height 
const heightPercentageToDP = (heightPercent) => {
    return (heightPercent * screenHeight) / 100;
};

const screenWidthGrater = screenWidth > 1100




export const Splash_Screen_Styles = StyleSheet.create({
    main_container: {
        flex: 1,
        overflow: 'hidden'
    },
    bg: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    logo: {
        marginBottom: 85,
        width: 118,
        height: 132
    },
    btn_container: {
        backgroundColor: "#FFFFFF",
        width: "46%",
        padding: 15,
        borderRadius: 10,
        marginBottom: 78
    },
    btn_text: {
        color: "#000000",
        fontWeight: "700",
        fontSize: 16,
        lineHeight: 19,
        textAlign: "center",
        letterSpacing: 0.03
    }
})
export const Auth_Screen_Styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    header: {
        flex: 0.23,
    },
    bg: {
        width: "100%",
        height: screenWidthGrater ? heightPercentageToDP(16) : screenHeight * 0.2,
        marginTop: screenWidthGrater ? heightPercentageToDP(3) : screenHeight * 0.03,
    },
    BackBtn: {
        backgroundColor: "#F5F4F8",
        justifyContent: "center",
        alignItems: "center",
        margin: screenWidthGrater ? widthPercentageToDP(2) : screenWidth * 0.02,
        width: screenWidthGrater ? widthPercentageToDP(12) : screenWidth * 0.12,
        height: screenWidthGrater ? widthPercentageToDP(12) : screenWidth * 0.12,
        borderRadius: screenWidthGrater ? widthPercentageToDP(6) : (screenWidth * 0.12) / 2,
    },
    body: {
        flex: 0.75,
        padding: screenWidthGrater ? widthPercentageToDP(2) : screenWidth * 0.05,
    },
    logo1: {
        width: widthPercentageToDP(30),
        height: heightPercentageToDP(15),
        alignSelf: "center",
    },
    heading: {
        color: COLORS.heading,
        fontWeight: "700",
        letterSpacing: 0.03,
        fontSize: screenWidthGrater ? widthPercentageToDP(2) : screenWidth * 0.05,
        marginBottom: screenWidthGrater ? heightPercentageToDP(1) : screenHeight * 0.02,
    },
    inputContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F4F8",
        flexDirection: "row",
        borderRadius: screenWidthGrater ? widthPercentageToDP(1) : screenWidth * 0.04,
        paddingTop: screenWidthGrater ? widthPercentageToDP(1) : screenWidth * 0.035,
        paddingBottom: screenWidthGrater ? widthPercentageToDP(1) : screenWidth * 0.02,
        marginTop: screenWidthGrater ? heightPercentageToDP(3) : screenHeight * 0.02,
    },
    input_Text: {
        color: COLORS.heading,
        fontWeight: "500",
        paddingLeft: 0,
        fontSize: screenWidthGrater ? widthPercentageToDP(1.5) : screenWidth * 0.04,
        paddingTop: Platform.OS === "ios" ? heightPercentageToDP(1) : -heightPercentageToDP(0.3),
        width: "90%"
    },
    showpasswordContainer: {
        flexDirection: "row-reverse",
        color: "#000000",
        fontWeight: "600",
        letterSpacing: 0.03,
        fontSize: widthPercentageToDP(2),
        marginBottom: heightPercentageToDP(2),
    },
    btnContainer: {
        backgroundColor: COLORS.btn_color,
        width: "100%",
        alignSelf: "center",
        padding: screenWidthGrater ? widthPercentageToDP(2) : screenWidth * 0.05,
        borderRadius: screenWidthGrater ? widthPercentageToDP(1) : screenWidth * 0.04,
        marginTop: screenWidthGrater ? heightPercentageToDP(5) : screenHeight * 0.03,
    },
    btnText: {
        color: "#FFFFFF",
        fontWeight: "700",
        letterSpacing: 0.03,
        textAlign: "center",
        fontSize: screenWidthGrater ? widthPercentageToDP(2) : screenWidth * 0.04,
    },
    footer: {
        flex: 0.07,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingBottom: heightPercentageToDP(2),
    },
    footerText: {
        color: "#53587A",
        fontWeight: "400",
        letterSpacing: 0.03,
        fontSize: widthPercentageToDP(3.5),
        lineHeight: heightPercentageToDP(2.5),
    }
});


export const Header_Styles = StyleSheet.create({
    Header_container: {
        width: "100%",
        height: 70,
        backgroundColor: COLORS.btn_color,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15
    },
    headerTextContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    headerText: {
        color: "#FFFFFF",
        fontWeight: "500",
        fontSize: 18,
        lineHeight: 32,
        marginLeft: 15
    }
})