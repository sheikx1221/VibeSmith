import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

const CircleImage = (props) => {
    const RequiredImage = props.requiredImage;
    const TextLable = props.TextLabel;
    const onPressFunction = props.onPressFunction;
    const ImageBackground = props.ImageBackground;
    const TextStyles = props.TextStyles;
    return(
        <TouchableOpacity onPress={onPressFunction} style={{justifyContent: 'center'}}>
            <View style={{
                borderRadius: 80 / 2,
                overflow: "hidden",
                backgroundColor:ImageBackground,
                width:40,
                height:40,
                alignItems:'center',
                justifyContent:'center'
            }}>
                <Image 
                    source={RequiredImage} 
                    style={{
                        width: "60%",
                        height: "60%",
                        alignSelf:'center',
                    }} 
                    resizeMode="contain"/>
            </View>
            <Text style={TextStyles}>{TextLable}</Text>
        </TouchableOpacity>
    )
}

export default CircleImage;