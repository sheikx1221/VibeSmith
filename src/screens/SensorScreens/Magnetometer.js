import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { Magnetometer } from 'expo-sensors'
import { useTheme } from '@react-navigation/native';
import CommonStyles from '../../themes/CommonStyles';

const MagnetometerSensor = (props) => {
    const { colors } = useTheme();
    const [_fast,setFast] = useState(false);
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const [isAvailable,setIsAvailable] = useState(false);
    BackHandler.addEventListener("hardwareBackPress", async()=>{
        await unsubscribe();
        props.navigation.goBack();
    })
    function slow(){
        Magnetometer.setUpdateInterval(1000);
    }
    function fast(){
        Magnetometer.setUpdateInterval(100);
    }
    async function subscribe(){
        await Magnetometer.isAvailableAsync().then((res)=>{
            if(res){
                setIsAvailable(true);
                setSubscription(
                    Magnetometer.addListener(result => {
                      setData(result);
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
    useEffect(() => {
        subscribe();
        return () => unsubscribe();
    }, []);
    function round(value){
        return parseFloat(value).toFixed(3);
    }
    const { x, y, z } = data;
    return(
        <View style={CommonStyles.MainView(colors.background)}>
            <Text style={CommonStyles.Heading(colors.primary)}>Magnetometer</Text>
            <Text style={CommonStyles.ParaText(colors.primary)}>A magnetometer is a device that measures magnetic field or magnetic dipole moment. Some magnetometers measure the direction, strength, or relative change of a magnetic field at a particular location.</Text>
            <Text style={CommonStyles.ParaText(colors.primary)}>Smartphones come equipped with a magnetometer so that your phone can sense its orientation in space, and use basic apps like the Compass App to determine your location with respect to Magnetic North (or South!). The way this is done is through an internal chip that contains a 3-axis magnetometer.</Text>
        
            {isAvailable?(
                <View>
                    <Text style={CommonStyles.SubText(colors.primary)}>
                        Synchronized Readings from Magnetometer
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
                    <Text style={CommonStyles.SubText(colors.primary)}>Sorry Your Phone Doesn't have a Magnetometer Sensor</Text>
                </View>
            )}

        </View>
    )

}

export default MagnetometerSensor;