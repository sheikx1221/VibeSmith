import React, { useState, useEffect } from 'react';
import CommonStyles from '../../themes/CommonStyles';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Barometer } from 'expo-sensors';

const BaromerterSensor = (props) => {
    const {colors} = useTheme();
    const [data, setData] = useState({}); 
    const [isAvailable,setIsAvailable] = useState(false);

    let _subscription = null;
    useEffect(() => {
        Barometer.isAvailableAsync().then(result=>{
            setIsAvailable(result);
        })
        _toggle();
    }, []);

    useEffect(() => {
        return () => {
          _unsubscribe();
        };
    }, []);

    const _toggle = () => {
        if (_subscription) {
          _unsubscribe();
        } else {
          _subscribe();
        }
    };

    const _subscribe = () => {
        _subscription = Barometer.addListener(barometerData => {
          setData(barometerData);
        });
    };
    
    const _unsubscribe = () => {
        _subscription && _subscription.remove();
        _subscription = null;
    };

    const { pressure = 0, relativeAltitude = 0 } = data;

    return(
        <View style={CommonStyles.MainView(colors.background)}>
        <Text style={CommonStyles.Heading(colors.primary)}>Barometer</Text>
        <Text style={CommonStyles.ParaText(colors.primary)}>The barometer assists the GPS chip inside the device to get a faster lock by instantly delivering altitude data. Additionally, the barometer can be utilized to provide 'floors climbed' information to a phones 'health' app.
        {'\n'}Barometers measure atmospheric pressure, so you can get a general sense of what’s going to happen by whether a barometer rises or falls. If the barometer goes up, then that means the weather is going to be fair. If it goes down, then it’s probably going to rain, snow, or indicate some other type of inclement weather.
        </Text>
        {isAvailable ? (
            <View>
                <Text style={CommonStyles.SubText(colors.primary)}>Pressure: {pressure * 100} Pa</Text>
                <Text style={CommonStyles.SubText(colors.primary)}>
                    Relative Altitude:{' '}
                    {Platform.OS === 'ios' ? `${relativeAltitude} m` : `Only available on iOS`}
                </Text>
                <View>
                    <TouchableOpacity onPress={_toggle} style={CommonStyles.ButtonContainerLarge(colors.primary)}>
                    <Text style={CommonStyles.ButtonTextSmall(colors.background)}>{_subscription ? "Turn Off": "Turn On"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ):(
            <View>
                <Text style={CommonStyles.SubText(colors.primary)}>Sorry Your Phone Doesn't have a Barometer Sensor</Text>
            </View>
        )}
        </View>
    )
}

export default BaromerterSensor;