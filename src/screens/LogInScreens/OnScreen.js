import React,{useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import CommonStyles from '../../themes/CommonStyles';
import { useTheme } from '@react-navigation/native';
import CustomMessages from './CustomMessages';
const OnScreen = (props) => {
    const { colors } = useTheme();
    const [Index, setIndex] = useState(0);
    const [spinValue] = useState(new Animated.Value(0));
    const [value, setValue] = useState(0);
    function nextIndex(index){
        setIndex(index);
    }
    function resetAnimation(){
        spinValue.setValue(0);
    }
    function startAnimate(){
        Animated.timing(
            spinValue,
          {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear, // Easing is an additional import from react-native
            useNativeDriver: true  // To make use of native driver for performance
          }
        ).start()
    }

    useEffect(()=>{
        startAnimate();
        spinValue.addListener(({value})=>{
            setValue(value);
        });
        return ()=>{
            spinValue.removeAllListeners();
            subscriber = null;
        }
    },[]);
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
    return(
        <View style={CommonStyles.MainView(colors.background)}>
            
            {value === 1 && (
                <>
                    <Text style={CommonStyles.Heading(colors.primary)}>{CustomMessages[Index].Heading}</Text>
                    <Text style={CommonStyles.ParaText(colors.primary)}>{CustomMessages[Index].Body}</Text>
                </>
            )}
            <Animated.Image 
                source={CustomMessages[Index].Image}
                style={{
                    width:"80%",
                    height:value === 1 ? "70%" : "100%",
                    alignSelf:'center',
                    transform: [{rotate: spin}]
                }}
                resizeMode="contain"
            />
            <TouchableOpacity style={[CommonStyles.ButtonContainerLarge(colors.primary),{alignSelf:'center',marginLeft:-5}]} onPress={()=>{
                const index = Index+1;
                if(index>(CustomMessages.length-1)){
                    props.handlerUpdate();
                }
                else{
                    resetAnimation();
                    startAnimate();
                    nextIndex(index);
                }
            }}>
                <Text style={[CommonStyles.ButtonTextLarge(colors.background)]}>{"Next"}</Text>
            </TouchableOpacity>
        </View>
    );
}
export default OnScreen;