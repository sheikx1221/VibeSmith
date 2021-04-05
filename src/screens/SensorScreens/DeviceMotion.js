import React, { useState, useEffect } from 'react';
import CommonStyles from '../../themes/CommonStyles';
import * as Permissions from 'expo-permissions';
import MotionData from './MotionData';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, BackHandler } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { DeviceMotion } from 'expo-sensors';

var _MotionData = [...MotionData];
var removeAll = false;
const DeviceMotionSensor = (props) => {
    const { colors } = useTheme();
    const [isAvailable,setIsAvailable] = useState(false);
    const [motionData,setMotionData] = useState({});
    const [typeNow,setTypeNow] = useState(null);
    let subscription = null;
    BackHandler.addEventListener("hardwareBackPress", async()=>{
        await unsubscribe();
        props.navigation.goBack();
    })
    useEffect(()=>{
        DeviceMotion.isAvailableAsync().then((res)=>{
            setIsAvailable(res);
            Permissions.askAsync(Permissions.MOTION).then(result=>{
                if(result.granted){
                    setIsAvailable(true);
                }
                else{
                    Alert.alert("Permission Not Granted!","Cannot detect device motion without permission");
                }
            }).catch(Err=>{
                setIsAvailable(false);
            });
        }).catch(err=>{
            setIsAvailable(false);
        });
    },[]);
    useEffect(()=>{
        // toggleSubscription();
        return async() => {
            await unsubscribe();
        }
    },[]);
    async function toggleSubscription(){
        if(subscription){
            await unsubscribe();
        }
        else{
            await subscribe();
        }
    }
    function executeNext(){
        let value = "";
        if(_MotionData.length === 0){
            resetNext();
        }
        value = _MotionData.shift();
        setTypeNow(value);
    }
    function resetNext(){
        _MotionData = [...MotionData];
        setTypeNow(null);
    }
    async function subscribe(){
        let updated = 0;
        if(removeAll) DeviceMotion.removeAllListeners();
        subscription = DeviceMotion.addListener((motionData) => {
            setMotionData(motionData);
            updated = updated + 1;
        });
        DeviceMotion.setUpdateInterval(3000);
    }
    async function unsubscribe(){
        subscription && subscription.remove();
        subscription = null;
        DeviceMotion.removeAllListeners();
    }
    function convertIntoDegree(radian){
        return (radian * (180/(22/7))).toFixed(2) + ' deg'
    }
    return(
        <View style={CommonStyles.MainView(colors.background)}>
            <Text style={CommonStyles.Heading(colors.primary)}>Device Motion</Text>
            <Text style={CommonStyles.ParaText(colors.primary)}>Device Motion provides access to the device motion and orientation sensors. All data is presented in terms of three axes that run through a device. According to portrait orientation: X runs from left to right, Y from bottom to top and Z perpendicularly through the screen from back to front.</Text>
            {isAvailable ? (
                <View>
                    {typeNow ? (
                        <>
                            <Text style={[CommonStyles.SubText(colors.primary),{paddingRight:10,textAlign:'justify'}]}>{typeNow.Definition}</Text>
                            {typeNow.Name === "Orientation" && (
                                <>
                                    {motionData.orientation!=null?(
                                        <View style={{flexDirection:'row'}}>
                                            <View style={{flex:0.7}}>
                                                <Text style={CommonStyles.SubText(colors.primary)}>Your Phone Orientation is: {(motionData.orientation===0 || motionData.orientation===180)?"Portrait":"Landscape"} at {motionData.orientation}° Angle</Text>
                                            </View>
                                            <View style={{flex:0.3}}>
                                                <Image 
                                                    source={typeNow.Image}
                                                    style={{width:'100%',height:100,transform:[{rotate:-1*motionData.orientation+'deg'}]}} 
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        </View>
                                    ):(
                                        <View>
                                            <Text style={CommonStyles.ButtonTextSmall(colors.primary)}>Orientation Data not received from Native Device</Text>
                                            <TouchableOpacity style={[CommonStyles.ButtonContainerLarge(colors.primary),{marginBottom:20}]} onPress={async()=>{
                                                removeAll = true;
                                                toggleSubscription();
                                            }}>
                                                <Text style={CommonStyles.ButtonTextSmall(colors.background)}>Try Again</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
                            {typeNow.Name==="Rotation"&&(
                                <>
                                {motionData.rotation!=null?(
                                    <View>
                                        <Text style={CommonStyles.ParaText(colors.primary)}>YAW (alpha) : {convertIntoDegree(motionData.rotation.alpha)}</Text>
                                        <Text style={CommonStyles.ParaText(colors.primary)}>PITCH (beta): {convertIntoDegree(motionData.rotation.beta)}</Text>
                                        <Text style={CommonStyles.ParaText(colors.primary)}>ROLL (gamma): {convertIntoDegree(motionData.rotation.gamma)}</Text>
                                    </View>
                                ):(
                                    <View>
                                        <Text style={CommonStyles.ButtonTextLarge(colors.primary)}>Device Motion of type {typeNow.Name} is not available in your device</Text>
                                    </View>
                                )}
                            </>                                
                            )}
                            {typeNow.Name==="Rotation Rate"&&(
                                <>
                                {motionData.rotationRate!=null?(
                                    <View>
                                        <Text style={CommonStyles.ParaText(colors.primary)}>YAW (alpha) : {convertIntoDegree(motionData.rotationRate.alpha)}</Text>
                                        <Text style={CommonStyles.ParaText(colors.primary)}>PITCH (beta): {convertIntoDegree(motionData.rotationRate.beta)}</Text>
                                        <Text style={CommonStyles.ParaText(colors.primary)}>ROLL (gamma): {convertIntoDegree(motionData.rotationRate.gamma)}</Text>
                                    </View>
                                ):(
                                    <View>
                                        <Text style={CommonStyles.ButtonTextLarge(colors.primary)}>Device Motion of type {typeNow.Name} is not available in your device</Text>
                                    </View>
                                )}
                            </>                                
                            )}
                            <TouchableOpacity style={CommonStyles.ButtonContainerLarge(colors.primary)} onPress={executeNext}> 
                                <Text style={CommonStyles.ButtonTextLarge(colors.background)}>Current Type: {typeNow.Name}</Text>
                            </TouchableOpacity>
                        </>                        
                    ):(
                        <TouchableOpacity style={CommonStyles.ButtonContainerLarge(colors.primary)} onPress={()=>{executeNext();subscribe()}}> 
                            <Text style={CommonStyles.ButtonTextLarge(colors.background)}>Press to Start and Change Motion Type</Text>
                        </TouchableOpacity>                        
                    )}
                </View>
            ):(
                <Text style={CommonStyles.SubText(colors.primary)}>Sorry Your Phone Doesn't have a Device Motion Sensor</Text>
            )}
        </View>
    );
}
export default DeviceMotionSensor;
