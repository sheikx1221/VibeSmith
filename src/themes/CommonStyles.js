import { Dimensions, PixelRatio, Platform } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { deviceName } from 'expo-device';
const { fontScale, width, height } = Dimensions.get('screen');

function scaleDown(value){
    const scaleOf = 0.88000
    if(fontScale.toFixed(5)>scaleOf) return value*scaleOf;
    if(fontScale.toFixed(5)<scaleOf) return value*fontScale.toFixed(5);
    return value;    
}

const InitialMargin = scaleDown(18);
const HeadingSize = scaleDown(44);
const SubHeadingSize = scaleDown(15);
const LowTextSize = scaleDown(13);
const ParaTextSize = scaleDown(13);
const ButtonTextLargeSize = scaleDown(17);
const ButtonTextSmallSize = scaleDown(15);

const MainView = (backgroundColor) => {
    return({flex:1,backgroundColor,marginTop: 30, alignSelf: 'center', width: '88%'});
}
const Heading = (color) => {
    return({fontSize:HeadingSize, fontFamily: "Montserrat-Bold", color, marginTop: -10, marginLeft: InitialMargin, letterSpacing: 4})
}
const SubText = (color) => {
    return({margin:5, fontSize:SubHeadingSize, fontFamily: 'Montserrat-SemiBold', color, marginLeft: InitialMargin + 5});
}
const LowText = (color) => {
    return({margin:5, fontSize:LowTextSize, fontFamily:'Montserrat', color, alignSelf:'center'});
}
const ParaView = () => {
    return({width: '85%', marginLeft: InitialMargin + 5});
}
const ParaText = (color) => {
    return({color, justifyContent:'center',fontSize:ParaTextSize,fontFamily:'Montserrat',marginRight:5})
}
const ButtonContainerLarge = (color) => {
    return({
        // flex:1, 
        backgroundColor:color,
        width:'60%',
        borderRadius:10,
        marginLeft:InitialMargin,
        marginTop:5
    });
}
const ButtonTextLarge = (color) => {
    return({
        color,
        padding:15,
        borderRadius:12,
        textAlign:'center',
        width:'100%',
        fontWeight:'bold',
        fontSize:ButtonTextLargeSize
    });
}
const ButtonContainerSmall = (color) => {
    return({
        flex:0.4, 
        backgroundColor:color,
        borderRadius:10,
        width:'90%',
        margin:4,
        marginLeft:InitialMargin
    });
}
const ButtonTextSmall = (color) => {
    return({
        color,
        padding:15,
        borderRadius:12,
        textAlign:'center',
        width:'100%',
        fontWeight:'bold',
        fontSize:ButtonTextSmallSize
    });
}
const ActiveButton = (colors, size) => {
    return({
        fontSize: scaleDown(size),
        fontWeight:'bold',
        textAlign:'center',
        borderRadius:10,
        padding:7,
        width:'90%',
        backgroundColor:colors.primary,
        color:colors.background,
        margin:1
    });
}
const InActiveButton = (colors, size) => {
    return({
        fontSize: scaleDown(size),
        fontWeight:'bold',
        textAlign:'center',
        borderRadius:10,
        borderWidth:0.6,
        borderColor:colors.primary,
        margin:1,
        padding:7,
        width:'90%',
        backgroundColor:colors.background,
        color:colors.primary
    });

}
const VybeButtonView = (color) => {
    return({
        borderRadius: 20,
        marginLeft: InitialMargin + 10,
        backgroundColor: color,
        width: '45%',
        marginTop: fontScale * 3 + "%"
    })
}
const VybeButtonText = (color) => {
    return({
        color: color,
        textAlign: 'center',
        padding: 15,
        fontSize: scaleDown(14),
        fontFamily:'Montserrat-SemiBold'
    })
}
const ActiveAxis = (color) => {
    return{
        fontFamily: 'Montserrat-SemiBold',
        fontSize: scaleDown(12),
        color: color
    }
}
const InActiveAxis = (color) => {
    return{
        fontFamily: 'Montserrat-SemiBold',
        fontSize: scaleDown(12),
        color: "#857671"
    }
}
const MainStyles = {
    MainView,
    Heading,
    SubText,
    LowText,
    ParaText,
    ParaView,
    ButtonContainerLarge,
    ButtonContainerSmall,
    ButtonTextLarge,
    ButtonTextSmall,
    ActiveButton,
    InActiveButton,
    VybeButtonView,
    VybeButtonText,
    ActiveAxis,
    InActiveAxis
}

export default MainStyles;