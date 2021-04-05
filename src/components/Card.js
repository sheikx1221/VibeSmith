import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import CommonStyles from '../themes/CommonStyles';

const Card = (props) => {
    return(
        <>
            {props.Touchable ? (
                <TouchableOpacity style={{
                    height:props.Height,
                    width:'90%',
                    alignSelf:'center', 
                    backgroundColor:props.backgroundColor,
                    shadowColor:props.backgroundColor,
                    elevation:5,
                    shadowOpacity:1,
                    borderRadius:10,
                    justifyContent:'center'
                }} onPress={props.OnPressHandler}>
                    {props.ImageComponent}
                        <Text style={CommonStyles.ButtonTextLarge(props.TextColor)}>{props.Text}</Text>
                    {props.description}
                </TouchableOpacity>
            ) : (
                <View style={{
                    height:props.Height,
                    width:'90%',
                    alignSelf:'center', 
                    backgroundColor:props.backgroundColor,
                    shadowColor:props.backgroundColor,
                    elevation:5,
                    shadowOpacity:1,
                    borderRadius:10,
                    justifyContent:'center'
                }} onPress={props.OnPressHandler}>
                    {props.ImageComponent}
                        <Text style={CommonStyles.ButtonTextLarge(props.TextColor)}>{props.Text}</Text>
                    {props.description}
                    {props.Button}
                </View>
            )}
        </>
    )
}

export default Card;