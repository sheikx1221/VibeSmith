import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { Gyroscope } from 'expo-sensors'
import { useTheme } from '@react-navigation/native';
import CommonStyles from '../../themes/CommonStyles';

const GyroscopeSensor = (props) => {
    const { colors } = useTheme();
    const [data,setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [isAvailable,setIsAvailable] = useState(false);
    const [subscription,setSubscription] = useState(null);
    const [_fast,setFast] = useState(false);
    BackHandler.addEventListener('hardwareBackPress',async()=>{
       await unsubscribe();
       props.navigation.goBack();
    });
    function slow(){
        Gyroscope.setUpdateInterval(1000);
    };
    function fast(){
        Gyroscope.setUpdateInterval(100);
    };
    async function subscribe(){
        await Gyroscope.isAvailableAsync().then((res)=>{
            if(res){
                setIsAvailable(true);
                setSubscription(
                    Gyroscope.addListener(gyroscopeData => {
                      setData(gyroscopeData);
                    })
                );
                slow();
            }
            else{
                setIsAvailable(false);
            }
        });
    }
    async function unsubscribe(){
        subscription && subscription.remove();
        setSubscription(null);
    }
    function round(value){
        return parseFloat(value).toFixed(3);
    }
    useEffect(() => {
        subscribe();
        return () => unsubscribe();
    }, []);
    const { x, y, z } = data;
    return(
        <View style={CommonStyles.MainView(colors.background)}>
            <Text style={CommonStyles.Heading(colors.primary)}>Gyroscope</Text>
            <Text style={CommonStyles.ParaText(colors.primary)}>Gyroscope sensors, also known as angular rate sensors or angular velocity sensors, are devices that sense angular velocity. Angular velocity is the change in rotational angle per unit of time. Angular velocity is generally expressed in deg/s (degrees per second).</Text>
            <Text style={CommonStyles.ParaText(colors.primary)}>Gyroscope provides access to the device's gyroscope sensor to respond to changes in rotation in 3D space.</Text>
            {isAvailable?(
                <View>
                    <Text style={CommonStyles.SubText(colors.primary)}>
                        Synchronized Readings from Gyroscope
                    </Text>
                    <View>
                        <View>
                        <Text style={CommonStyles.SubText(colors.primary)}>
                            X = {round(x)}
                        </Text>
                        </View>
                        <View>
                        <Text style={CommonStyles.SubText(colors.primary)}>
                            Y = {round(y)}
                        </Text>
                        </View>
                        <View>
                        <Text style={CommonStyles.SubText(colors.primary)}>
                            Z = {round(z)}
                        </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=>{_fast?slow():fast(); setFast(_fast?false:true)}} 
                        style={CommonStyles.ButtonContainerLarge(colors.primary)}
                    >
                        <Text style={CommonStyles.ButtonTextLarge(colors.background)}>Speed: {_fast ? "Fast" : "Slow"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={subscription ? unsubscribe : subscribe} 
                        style={CommonStyles.ButtonContainerLarge(colors.primary)}
                    >
                        <Text style={CommonStyles.ButtonTextLarge(colors.background)}>Turn Readings {subscription ? "Off" : "On"}</Text>
                    </TouchableOpacity>
                </View>
            ):(
                <View>
                    <Text style={CommonStyles.SubText(colors.primary)}>Sorry Your Phone Doesn't have a Gyroscope Sensor</Text>
                </View>
            )}
        </View>
    );
}

export default GyroscopeSensor;