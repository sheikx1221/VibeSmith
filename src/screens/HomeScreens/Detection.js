import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonStyles from '../../themes/CommonStyles';
import MainService from '../../services/MainService';
import { useIsFocused } from '@react-navigation/native';
import DialogInput from 'react-native-dialog-input';
import * as Progress from 'react-native-progress';

const Detection = (props) => {
    const { colors } = useTheme();
    const [activate,setActivate] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentSize,setCurrentSize] = useState("");
    const [vibeName, setVibeName] = useState("MOVINNG");
    const isFocused = useIsFocused();

    function setActivateValue(value){
        setTimeout(() => {
            setProgress(0);
            setActivate(value);
        }, 1000);
    }

    useEffect(()=>{
        async function getBytesSaved(){
            const bytesSaved = await AsyncStorage.getItem("@BytesSaved");
            if(bytesSaved!=0){
                setCurrentSize(MainService.formatBytes(bytesSaved));
            }
            else{
                setCurrentSize(0 + " Bytes");
            }
        }
        getBytesSaved();
    },[isFocused])
    useEffect(()=>{
        DeviceEventEmitter.addListener("updated-bytes",(updatedBytes)=>{
            setCurrentSize(updatedBytes);
        });
        DeviceEventEmitter.addListener("stop-service",()=>{
            setActivateValue(false);
        });
        return ()=>{
            DeviceEventEmitter.removeListener("updated-bytes",()=>{
            });
            DeviceEventEmitter.removeListener("stop-service");
        }
    },[]);
    return(
        <View style={CommonStyles.MainView(colors.background)}>
            {(vibeName == "" ? (
                <DialogInput isDialogVisible={vibeName == "" ? true : false}
                    title={"Enter A Vybe Name"}
                    message={"Uniquely Identify this moment by giving it a name"}
                    hintInput ={"Dancing, Moving, Party Mode"}
                    submitInput={ (inputText) => {setVibeName(inputText)} }
                    closeDialog={ () => {if(vibeName == ""){
                        Alert.alert('Please add a vybe name!','Vybe Name Cannot Be Empty')
                    }}}>
                </DialogInput>  
            ) : (
                <>
                {(activate === false) ? (
                    <View>
                        <Text style={CommonStyles.Heading(colors.primary)}>{'CAPTURE\nYOUR\nVYBE'}</Text>
                        <Text style={CommonStyles.SubText(colors.primary)}>YOUR ARE YOUR VYBESMITH</Text>
                        <View style={CommonStyles.ParaView()}>
                            <Text style={CommonStyles.ParaText(colors.primary)}>
                                Press and hold to begin capturing your Vybe. Remember it's best if there is movement for atleast 30 seconds. So have fun with it! 
                            </Text>
                        </View>
                        <TouchableWithoutFeedback onLongPress={() => {
                            setProgress(progress + 1);
                            MainService.startAllSensors(vibeName);
                        }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
                                <Progress.Circle
                                    key={"Starter"}
                                    size={280}
                                    indeterminate={false}
                                    color={colors.background}
                                    progress={progress}
                                    borderWidth={0}
                                    direction="clockwise"
                                    showsText
                                    formatText={(progress) => {
                                        if (progress === 1) {
                                            setActivateValue(true);
                                        }
                                        return progress > 0 ? `${(progress * 100).toFixed(0)}%` : "BEGIN"
                                    }}
                                    fill={colors.border}
                                    textStyle={{
                                        fontWeight: 'bold',
                                        fontSize: 50,
                                        letterSpacing: 6
                                    }}
                                    thickness={0}
                                    unfilledColor={colors.border}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                ):(
                    <View>
                        <Text style={CommonStyles.Heading(colors.primary)}>{'VYBESMITH\nIS\nRUNNING'}</Text>
                        <Text style={CommonStyles.SubText(colors.primary)}>YOUR ARE YOUR VYBESMITH</Text>
                        <View style={CommonStyles.ParaView()}> 
                            <Text style={CommonStyles.ParaText(colors.primary)}>Press and Hold the Stop Recording your Vybe. VybeSmith will save this data and will make your custom vybes.</Text>
                        </View>
                        <TouchableWithoutFeedback onLongPress={() => {
                            setProgress(progress + 1);
                            MainService.stopAllSensors();
                        }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
                                <Progress.Circle
                                    key={"Stopper"}
                                    size={280}
                                    indeterminate={false}
                                    color={colors.background}
                                    progress={progress}
                                    borderWidth={0}
                                    direction="clockwise"
                                    showsText
                                    formatText={(progress) => {
                                        if (progress === 1) {
                                            setActivateValue(false);
                                        }
                                        return progress > 0 ? `${(progress * 100).toFixed(0)}%` : "STOP"
                                    }}
                                    fill={colors.border}
                                    textStyle={{
                                        fontWeight: 'bold',
                                        fontSize: 50,
                                        letterSpacing: 6
                                    }}
                                    thickness={0}
                                    unfilledColor={colors.border}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                )}
            </>
            ))}

        </View>
    )
}
export default Detection;