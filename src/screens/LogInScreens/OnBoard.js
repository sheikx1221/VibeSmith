import React,{ useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, SafeAreaView, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Messages from './CustomMessages';

const { fontScale, width }  = Dimensions.get('screen');
function scaleDown(value){
    const scaleOf = 0.88000
    if(fontScale.toFixed(5) > scaleOf){
        return value * scaleOf
    }
    else{
        return value;
    }
}
const onBoard = (props) => {
    const [index, setIndex] = useState(0);
    const { colors } = useTheme();
    function setView(Body){
        if(Body === ""){
            return {flexDirection: 'column', flex:1, justifyContent: 'flex-end', alignItems: 'center',marginLeft: '10%'};
        }
        else{
            return {flexDirection: 'column', flex:1, justifyContent: 'flex-end', alignItems: 'center'};
        }
    }
    return(
        <View style={{flex: 1}}>
            <StatusBar hidden={true}/>
            <SafeAreaView style={{flex: 1}}>
                <ImageBackground style={{flex: 1}} source={Messages[index].Image}>
                    <View style={setView(Messages[index].Body)}>
                        {Messages[index].Heading === "VYBESMITH" ? (
                            <View style={{marginLeft: '-10%'}}>
                                <Image source={require('../../../assets/sensors/main.png')} style={{width: 100, height: 100, alignSelf:'center'}} resizeMode="contain"/>
                                <Text style={styles.HeadingFinal}>{Messages[index].Heading}</Text>
                                <Text style={styles.SubHeadingFinal}>{Messages[index].Subheading}</Text>
                                <Text style={Messages[index].Body === "" ? {marginBottom: 20} : styles.Body}>{Messages[index].Body}</Text>
                                <TouchableOpacity style={{}} onPress={()=>{
                                    props.handlerUpdate();
                                }}>
                                    <Text style={styles.ButtonFinal}>{Messages[index].Heading!=="VYBESMITH"?"CONTINUE":"START VYBING"}</Text>
                                </TouchableOpacity>
                            </View>
                        ): (
                            <View>
                                <Text style={styles.Heading}>{Messages[index].Heading}</Text>
                                <Text style={Messages[index].Body === "" ? {...styles.SubHeading, marginTop: -5} : styles.SubHeading}>{Messages[index].Subheading}</Text>
                                <Text style={Messages[index].Body === "" ? {marginBottom: -15} : styles.Body}>{Messages[index].Body}</Text>
                                <TouchableOpacity style={styles.ButtonContainer} onPress={()=>{
                                    setIndex(index+1);
                                }}>
                                    <Text style={styles.Button}>{Messages[index].Heading!=="VYBESMITH"?"CONTINUE":"START VYBING"}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    Heading: {
        color: "white",
        fontFamily:'Montserrat-Bold',
        fontSize: scaleDown(49),
        letterSpacing: 3,
        textAlign: 'left',
    },
    HeadingFinal: {
        color: "white",
        fontFamily:'Montserrat-Bold',
        fontSize: scaleDown(25),
        letterSpacing: 8,
    },
    SubHeading: {
        color: "white",
        fontSize: scaleDown(14),
        textAlign: 'left',
        fontFamily:'Montserrat-Bold',
        marginTop: '3%',
        marginBottom: '3%'
    },
    SubHeadingFinal: {
        color: "white",
        fontSize: scaleDown(14),
        textAlign: 'center',
        fontFamily:'Montserrat-Bold',
        width: 190,
        marginTop: '3%',
        marginBottom: '3%',
    },
    Body: {
        fontSize: scaleDown(14),
        textAlign: "left",
        color: "white",
        marginBottom: '5%',
        fontFamily: 'Montserrat',
        width: width * 0.60
    },
    Button: {
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
        color: "white",
        backgroundColor: "#f07b3f",
        borderRadius: 30,
        padding: scaleDown(15),
        marginBottom: "25%",
        paddingRight: scaleDown(30),
        paddingLeft: scaleDown(30)
    },
    ButtonFinal: {
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
        color: "white",
        backgroundColor: "#f07b3f",
        borderRadius: 30,
        padding: scaleDown(15),
        marginBottom: "5%"
    },
    ButtonContainer: {
        width: "40%",
        alignSelf: 'flex-start',
    }
});
export default onBoard;