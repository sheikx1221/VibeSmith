import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import CommonStyles from '../../themes/CommonStyles';
import { useTheme } from '@react-navigation/native';
import SensorDatabase from '../../services/SensorDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MailComposer from 'expo-mail-composer';
import * as Device from 'expo-device';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useIsFocused } from '@react-navigation/native';

const MailUp = (props) => {
    const { colors, dark } = useTheme();
    const isFocused = useIsFocused();
    const [filePath, setFilePath] = useState([]);
    const [infoOk, setInfoOk] = useState(false);
    const [userInfo, setUserInfo] = useState({
        Name: "",
        Contact: "",
        Email: "",
        DeviceInfo: "",
        UUID: ""
    });
    const [showActivity, setShowActivity] = useState(true);
    const messages = ["Please Fill Information","Validate Your Information","Send Sensor Logs to VibeSmith","Delete Previous Logs"];
    const [loading, setLoading] = useState("Fetching Database records for all dates");
    const [messageIndex, setMessageIndex] = useState(0);
    const [Name, setName] = useState(undefined);
    const [Contact, setContact] = useState(undefined);
    const [Email, setEmail] = useState(undefined);
    const [UUID, setUUID] = useState(undefined);
    const screens = ["Information","VibeForms","Payment","SendLogs","DeleteLogs"];
    const [screen, setScreen] = useState("Information");
    useEffect(()=>{
        setInfoOk(false);
        setShowActivity(true);
        setMessageIndex(0);
        setUUID(undefined);
        setName(undefined);
        setContact(undefined);
        setEmail(undefined);
        setLoading("Fetching Database records for all dates");
        async function fetchUserInformation(){
            await AsyncStorage.multiGet([
                "@UserName",
                "@UserContact",
                "@UserEmail",
                "@UserUUID"
            ]).then(response=>{
                let user = {
                    Name: response[0][1],
                    Contact: response[1][1],
                    Email: response[2][1],
                    UUID: response[3][1],
                    DeviceInfo:deviceInfo()
                }
                setName(user.Name);
                setEmail(user.Email);
                setContact(user.Contact);
                setUUID(user.UUID);
                let validRecords = true;
                for(let key of Object.keys(user)){
                    if(!user[key]){
                        validRecords = false;
                        break;
                    }
                }
                if(validRecords){
                    setMessageIndex(1);
                }
                else{
                    setMessageIndex(0);
                }
                setUserInfo(user);
            });
        }
        function deviceInfo(){
            return Device.manufacturer + " " + Device.modelName + " " +Device.osName;
        }
        fetchUserInformation();
    },[isFocused]);
    async function fetchFilePath(){
        if(!SensorDatabase.checkDatabaseRunning()){
            await SensorDatabase.startDataBase();
        }
        await SensorDatabase.fetchAll().then((dataRecords)=>{
            if(dataRecords.length>0){
                setLoading("Converting Logs into CSV File");
                setTimeout(async() => {
                    await SensorDatabase.saveToFile(UUID, dataRecords).then(filepath=>{
                        setLoading("New Sensor Data file has been created!");
                        setShowActivity(false);
                        setFilePath(filepath);
                    });
                }, 4000);
            }
            else{
                setLoading("No Logs Found.");
                setShowActivity(false);
            }
        })
    }
    async function saveUserInfo(){
        let id = "";
        if(!UUID){
            id = uuidv4();
            setUUID(id);
        }
        else{
            id = UUID;
        }
        const items = [["@UserName",Name],["@UserEmail",Email],["@UserContact",Contact],["@UserUUID",id]];
        AsyncStorage.multiSet(items, () => {
            setMessageIndex(2);
            setTimeout(() => {
                fetchFilePath();
            }, 2000);
        });
    }
    return(
        <View style={CommonStyles.MainView(colors.background)}>
            <Text style={CommonStyles.Heading(colors.primary)}>{messages[messageIndex]}</Text>
            {screen === "Information" && (
                <>
                {infoOk?(
                    <></>
                ):(
                    <View style={{marginTop:'10%'}}>
                        <Text style={CommonStyles.SubText(colors.primary)}>Enter your Name</Text>
                        <TextInput 
                            value={Name}
                            onChangeText={(text)=>{
                                setName(text);
                            }}
                            style={styles.input(colors.primary)}
                        />
                        <Text style={CommonStyles.SubText(colors.primary)}>Enter your Email Address</Text>
                        <TextInput 
                            value={Email}
                            onChangeText={(text)=>{
                                setEmail(text)
                            }}
                            style={styles.input(colors.primary)}
                        />
                        <Text style={CommonStyles.SubText(colors.primary)}>Enter your Contact Number</Text>
                        <TextInput 
                            value={Contact}
                            onChangeText={(text)=>{
                                setContact(text)
                            }}
                            style={styles.input(colors.primary)}
                        />
                        <TouchableOpacity style={CommonStyles.ButtonContainerLarge(colors.primary)} onPress={()=>{
                            if(Name && Email && Contact){
                                const deviceInfo = userInfo.DeviceInfo
                                setUserInfo({
                                    Name,
                                    Contact,
                                    UUID,
                                    Email,
                                    DeviceInfo:deviceInfo
                                });
                                setInfoOk(true);
                                saveUserInfo();
                            }
                            else{
                                Alert.alert("Complete All Information","Please Fill Information Correctly!");
                            }
                        }}>
                            <Text style={CommonStyles.ButtonTextLarge(colors.background)}>{messageIndex === 0 ? "Save Information" : "Validate Information"}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                </>
            )}
            {screen === "VibeForm" && (
                <>
                </>
            )}
            {screen === "Payment" && (
                <></>
            )}
            {screen === "SendLogs" && (
                <></>
            )}
            {screen === "DeleteLogs" && (
                <></>
            )}














            {infoOk === false && (
                <></>
            )}
            {infoOk && (
                <View>
                    <View style={{justifyContent:'center', alignItems:'center',height:'100%', marginTop:'-5%'}}>
                        {showActivity ? (
                            <ActivityIndicator size={100} color={colors.primary}/>
                        ):(
                            <>
                            {loading.includes("No")?(
                                <Text style={[CommonStyles.Heading(colors.primary),{fontSize:80}]}>404</Text>
                            ):(
                                <>
                                    {loading.includes("Delete")?(
                                        <Image 
                                            source={dark ? require("../../../assets/sensors/deleteLogsWhite.png"): require("../../../assets/sensors/deleteLogsBlack.png")}
                                            style={{width: '80%', height:"50%", borderWidth:1, marginTop:'-10%'}}
                                            resizeMode="contain"                                   
                                        />
                                    ):(
                                        <Image 
                                            source={dark ? require("../../../assets/sensors/doneWhite.png") : require("../../../assets/sensors/doneBlack.png")}
                                            style={{width: '80%', height:"50%", borderWidth:1, marginTop:'-10%'}}
                                            resizeMode="contain"
                                        />
                                    )}
                                </>
                            )}
                            </>
                        )}
                        <Text style={CommonStyles.ButtonTextLarge(colors.primary)}>{loading}</Text>
                        {(showActivity===false && loading.includes("No Logs")===false)&&(
                            <TouchableOpacity style={[CommonStyles.ButtonContainerLarge(colors.primary),{alignSelf:'center'}]} onPress={async()=>{
                                if(loading.includes("Delete")){
                                    await SensorDatabase.clearDatabase();
                                    SensorDatabase.updateBytesSaved(0);
                                    setLoading("No Logs Found.");
                                }
                                else{
                                    MailComposer.isAvailableAsync().then(async res=>{
                                        if(res){
                                            await MailComposer.composeAsync({
                                                attachments:[filePath],
                                                recipients:["museworks1@gmail.com","sheikxhassan1221@gmail.com"],
                                                subject:"VibeSmith Sensor Data For User: "+Name,
                                                body:userInfo.DeviceInfo + "\n" + userInfo.Contact + "\n" + userInfo.UUID
                                            }).then(result=>{
                                                setLoading("Delete previous logs to save some space");
                                            })
                                        }
                                        else{
                                            Alert.alert("Unable to Compose Mail","Mail Composer is not Available in your device");
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    })
                                }
                            }}>
                                <Text style={CommonStyles.ButtonTextLarge(colors.background)}>
                                    {loading.includes("Delete")?"Delete Previous logs":"Send Logs to VibeSmith"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    input:function(colors){
        return({
            width: "90%",
            padding: 10,
            margin: 4,
            marginTop:1,
            borderRadius: 10,
            // backgroundColor:theme.secondaryColor,
            alignSelf:'center',
            fontSize:19,
            borderBottomWidth:0.7,
            color:colors
        })
    }
})

export default MailUp;