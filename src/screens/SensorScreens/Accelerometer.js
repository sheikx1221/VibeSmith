import React,{ useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import CommonStyles from '../../themes/CommonStyles';
import { useTheme } from '@react-navigation/native';

const AccelerometerSensor = (props) => {
    const {colors} = useTheme();
    const RequiredImage = props.route.params.RequiredImage;
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [fast,setFast] = useState(false);
    const [subscription, setSubscription] = useState(null);
    BackHandler.addEventListener("hardwareBackPress",async()=>{
      await _unsubscribe();
      props.navigation.goBack();
    })
    const _slow = () => {
        Accelerometer.setUpdateInterval(1000);
    };
    const _fast = () => {
        Accelerometer.setUpdateInterval(100);
    };
    const _subscribe = () => {
        setSubscription(
          Accelerometer.addListener(accelerometerData => {
            setData(accelerometerData);
          })
        );
        _slow();
    };
    const _unsubscribe = async() => {
        subscription && subscription.remove();
        setSubscription(null);
    };
    useEffect(() => {
        _subscribe();
        return async() => await _unsubscribe();
    }, []);
    const { x, y, z } = data;

    function round(value){
        return parseFloat(value).toFixed(3);
    }
    return (
      <View style={CommonStyles.MainView(colors.background)}>
        <Text style={CommonStyles.Heading(colors.primary)}>Accelerometer</Text>
        <Text style={CommonStyles.ParaText(colors.primary)}>
          An accelerometer is a device that measures the vibration, or
          acceleration of motion of a structure. The force caused by vibration
          or a change in motion (acceleration) causes the mass to "squeeze" the
          piezoelectric material which produces an electrical charge that is
          proportional to the force exerted upon it.
        </Text>
        <Text style={CommonStyles.SubText(colors.primary)}>
          Synchronized Readings from Accelerometer
        </Text>

        <View style={{flexDirection:'row'}}>
          {/* READINGS */}
          <View style={{flex:0.5}}>
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
          {/* GRAPH || ACTIONS */}
          <View style={{flex:0.5}}>
            <View>

            </View>
            <View>

            </View>
            <View>
           
            </View>
          </View>
        </View>
        
        <View style={{width:'100%'}}>
            <TouchableOpacity onPress={()=>{fast?_slow():_fast(); setFast(fast?false:true)}} 
                style={CommonStyles.ButtonContainerLarge(colors.primary)}
            >
                <Text style={CommonStyles.ButtonTextLarge(colors.background)}>Speed: {fast ? "Fast" : "Slow"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} 
                style={CommonStyles.ButtonContainerLarge(colors.primary)}
            >
                <Text style={CommonStyles.ButtonTextLarge(colors.background)}>Turn Readings {subscription ? "Off" : "On"}</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
}
export default AccelerometerSensor;