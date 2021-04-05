import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors'
import { useTheme } from '@react-navigation/native';
import CommonStyles from '../../themes/CommonStyles';

const PedometerSensor = (props) => {
    const { colors } = useTheme();
    const [isAvailable,setIsAvailable] = useState(false);
    const [pastStepCount,setPastStepCount] = useState(0);
    const [currentStepCount,setCurrentStepCount] = useState(0);
    let subscription = null;

    async function subscribe(){
        subscribe = Pedometer.watchStepCount((result)=>{
            setPastStepCount(result);
        });

        Pedometer.isAvailableAsync().then((res)=>{
            setIsAvailable(res);
        }).catch(Err=>{
            console.log(Err);
        });
        const start = new Date();
        start.setDate(start.getDate()-1);
        const end = new Date();
        // start.setDate(end.getDate() - 1);
        Pedometer.getStepCountAsync(start, end).then(
          result => {
              setPastStepCount(result.steps);
          },
          error => {
            console.log(error)
            setPastStepCount(-1);
          }
        );
    }
    async function unsubscribe(){
       subscription &&subscription.remove();
       subscription = null;
    }
    useEffect(()=>{
        subscribe();
        return ()=>{
            unsubscribe();
        }
    },[])
    return(
        <View style={CommonStyles.MainView(colors.background)}>
            <Text style={CommonStyles.Heading(colors.primary)}>Pedometer</Text>
            <Text style={CommonStyles.ParaText(colors.primary)}>Pedometer counts each step a person takes by detecting the motion of the person's hands or hips. Distance traveled (by walking or any other means) can be measured directly by a GPS receiver.{'\n'}</Text>
            <Text style={CommonStyles.ParaText(colors.primary)}>The technology for a pedometer includes a mechanical sensor and software to count steps. Early forms used a mechanical switch to detect steps together with a simple counter.</Text>
            <Text style={CommonStyles.SubText(colors.primary)}>{pastStepCount + "|" + isAvailable}</Text>
        </View>
    )
}
export default PedometerSensor;