import React, {useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import CommonStyles from '../../themes/CommonStyles';
import { useTheme, useIsFocused } from '@react-navigation/native';
import SensorDatabase from '../../services/SensorDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Cart from './Cart';
import Payment from './Payments';
import { EMAIL_API, AUTH_KEY } from '@env';
import * as MailComposer from 'expo-mail-composer';

const screens = ["Cart","UserInfo","Payment","SendLogs"];
let _screenNow = "Cart";
let manualOverride = false;
const Mails = (props) => {
    const isFocused = useIsFocused();
    const { width, height } = Dimensions.get("window");
    const { colors, dark } = useTheme();
    const MainScroll = useRef(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [uuid, setUUID] = useState("");
    const [device, setDeviceInfo] = useState("");
    const [filePath, setFilePath] = useState("");
    const [screenNow, setScreenNow] = useState("Cart");
    const [messageIndex, setMessageIndex] = useState(0);
    const [packageSelected, setPackageSelected] = useState("");
    const [loading, setLoading] = useState("Fetch Vibes for Email");
    const [showActivity, setShowActivity] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const messages = [
        "UPLOAD\nYOUR\nVYBE",
        "ADD\nPAYMENT\nMETHOD",
        "UPLOADING\nYOUR\nVYBES",
        "",
    ];
    const subMessages = [
        `NOW IT’S TIME FOR VYBE FORMING`,
        `NOW IT’S TIME FOR VYBE FORMING`,
        `PLEASE WAIT`,
        ``
    ];
    const description = [
        `Each Vybe you’ve bottled will generate multiple (~5) VybeForms which will be submitted to you via email. There you can select your material, for example fold or silver. Your price will be calculated for the final crafting of your beautifully unique VybeForm.`,
        `Each Vybe you’ve bottled will generate multiple (~5) VybeForms which will be submitted to you via email. There you can select your material, for example fold or silver. Your price will be calculated for the final crafting of your beautifully unique VybeForm.`,
        `You will get your custom artistic vybes after 2-3 working days`,
        ``
    ];

    async function saveUserInfo(){
        let id = "";
        if(!uuid){
            id = uuidv4();
            setUUID(id);
        }
        else{
            id = uuid;
        }
        const items = [["@UserName",name],["@UserEmail",email],["@UserContact",phone],["@UserUUID",id]];
        AsyncStorage.multiSet(items, async() => {
            if(!SensorDatabase.checkDatabaseRunning()){
                await SensorDatabase.startDataBase();
            }
            await SensorDatabase.getBlocksAdded().then(blocksAdded=>{                
                if(blocksAdded.length>0){
                    const onlyIDs = blocksAdded.map((block)=>{ return block.BlockID});
                    setMessageIndex(1);
                    setScreenNow("Payment");
                    setBlocks(onlyIDs);
                }
                else{
                    Alert.alert("Cart Empty","Kindly Check the Vybes that you need to send!");
                }
            });
        });
    }
    async function fetchFilePath(){
        if(!SensorDatabase.checkDatabaseRunning()){
            await SensorDatabase.startDataBase();
        }
        await SensorDatabase.fetchAll().then((dataRecords)=>{
            setShowActivity(true);
            if(dataRecords.length>0){
                setLoading("Converting Logs into CSV File");
                setTimeout(async() => {
                    await SensorDatabase.saveToFile(uuid, dataRecords, blocks).then(filepath=>{
                        setLoading("New Sensor Data file has been created!");
                        if(_screenNow === "SendLogs") setShowActivity(false);
                        setFilePath(filepath);
                    });
                }, 3000);
            }
        });
    }
    function scrollToTop(){
        MainScroll.current.scrollTo({ y: 0, animated: true});
    }
    useEffect(()=>{
        if(manualOverride) return;
        _screenNow = screenNow;
        scrollToTop();
        if(screenNow === "UserInfo") setMessageIndex(0);
        if(screenNow === "SendLogs"){
            fetchFilePath().then(async res=>{
                const body = new FormData();
                body.append('csv', {
                    uri: filePath,
                    name: "sensorData.csv",
                    type: "application/csv"
                });
                body.append('Email', email);
                body.append('Username', name);
                body.append('Subject', 'VybeSmith Sensor Data For User: '+name);
                body.append('Body',`${device}\n${phone}\n${uuid}`);

                const data = {
                    body: body,
                    method: 'POST',
                    headers:{
                        "Content-Type": "multipart/form-data",
                        "Authorization": AUTH_KEY,
                        "Connection": "keep-alive",
                        "Accept-Encoding": "gzip, deflate, br"
                    }
                }
                await fetch(EMAIL_API, data).then(res=>res.json()).then(result=>{
                    if(!result.success) throw result.response.err;
                    setMessageIndex(3);
                    setShowActivity(false);
                }).catch(err=>{
                    console.log(err);
                    setMessageIndex(3);
                    setScreenNow("ErrorWhileSendingVybes");
                    Alert.alert("Failed to Send Vybes to VybeSmith","Internal Server Error: "+err.code+"\n");
                    setShowActivity(false);
                });
                // setTimeout(() => {
                //     setScreenNow("ErrorWhileSendingVybes");
                //     Alert.alert("Failed to Send Vybes to VybeSmith","Internal Server Error: 400");
                //     setShowActivity(false);
                // }, 2000);
            }).catch(Err=>{
                console.log(Err);
                setMessageIndex(3);
                setScreenNow("ErrorWhileSendingVybes");
                Alert.alert("Failed to Send Vybes to VybeSmith","Internal Server Error: "+err.code+"\n");
                setShowActivity(false);
            });
        }
    },[screenNow]);
    function backPress(){
        console.log(_screenNow);
        switch(_screenNow){
            case "Cart":
                props.navigation.goBack();
                break;
            case "UserInfo":
                setScreenNow("Cart");
                break;
            case "Payment":
                setScreenNow("UserInfo");
                setMessageIndex(0);
                break;
            case "SendLogs":
                setScreenNow("Payment");
                setShowActivity(true);
                setMessageIndex(1);
                break;
        }
    }
    useEffect(()=>{
        if(isFocused) setScreenNow("Cart");setShowActivity(false);
    },[isFocused]);
    function getWidthCart(){
        if(_screenNow === "Cart"){
            return {width: width * 0.40,alignItems:'center'};
        }
        else{
            return {width: width * 0.30,alignItems:'center'};
        }
    }
    useEffect(()=>{
        props.navigation.setOptions({
            headerShown: true,
            headerTitle:"",
            headerStyle:{
                height:70,
                backgroundColor: colors.background
            },
            headerTransparent:true,
            headerRight: (()=>(
                <TouchableOpacity style={{width: width * 0.30, backgroundColor: colors.background, height: 50, justifyContent: 'center'}} onPress={backPress}>
                    <Text style={CommonStyles.SubText(colors.primary)}>{'< BACK'}</Text>
                </TouchableOpacity>
            )),
            headerLeft:(()=>(
                <View style={[getWidthCart(),{backgroundColor: colors.background, zIndex: 9998}]}>
                    <Image 
                        source={require('../../../assets/svgs/cart_black.png')} 
                        style={{width: 40, height: 50}} 
                        resizeMode="contain"
                    />
                </View>
            )),
            headerTitleContainerStyle: {
                backgroundColor: colors.background,
                height: 50
            }
        })
    },[screenNow]);
    useEffect(()=>{
        function deviceInfo(){
            return Device.manufacturer + " " + Device.modelName + " " +Device.osName;
        }
        async function getUserInformation(){
            await AsyncStorage.multiGet([
                "@UserName",
                "@UserContact",
                "@UserEmail",
                "@UserUUID"
            ]).then(response=>{
                setName(response[0][1]);
                setPhone(response[1][1]);
                setEmail(response[2][1]);
                setUUID(response[3][1]);
                setDeviceInfo(deviceInfo());
                for(let i=0;i<=3;i++){
                    if(!response[i][1]){
                        setMessageIndex(0);
                        break;
                    }
                }
            });
        }
        getUserInformation();
    },[]);
    function PaymentToLogs(){
        setMessageIndex(2);
        setScreenNow("SendLogs");
        setShowActivity(true);
    }
    return(
        <ScrollView ref={MainScroll} style={CommonStyles.MainView(colors.background)} showsVerticalScrollIndicator={false}>
            {screenNow !== "Cart" && (
                <View>
                    <Text style={[CommonStyles.Heading(colors.primary), { marginTop: 20 }]}>{messages[messageIndex]}</Text>
                    <Text style={CommonStyles.SubText(colors.primary)}>{subMessages[messageIndex]}</Text>
                    <View style={CommonStyles.ParaView()}>
                        <Text style={CommonStyles.ParaText(colors.primary)}>{description[messageIndex]}</Text>
                    </View>
                </View>
            )}
            {screenNow == "Cart" && (
                <Cart navigation={props.navigation} onPressHandler={setScreenNow}/>
            )}
            {screenNow == "UserInfo" && (
                <View style={{ marginTop: '10%' }}>
                    <Text style={CommonStyles.SubText(colors.primary)}>NAME</Text>
                    <TextInput
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                        }}
                        placeholder={"ENTER NAME HERE"}
                        placeholderTextColor={colors.primary}
                        style={styles.input(colors)}
                    />
                    <Text style={CommonStyles.SubText(colors.primary)}>EMAIL</Text>
                    <TextInput
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text)
                        }}
                        placeholderTextColor={colors.primary}
                        placeholder={"EMAIL ADDRESS"}
                        style={styles.input(colors)}
                    />
                    <Text style={CommonStyles.SubText(colors.primary)}>PHONE NUMBER</Text>
                    <TextInput
                        value={phone}
                        onChangeText={(text) => {
                            setPhone(text)
                        }}
                        placeholder="PHONE NUMBER"
                        placeholderTextColor={colors.primary}
                        style={styles.input(colors)}
                    />
                    <TouchableOpacity style={[CommonStyles.VybeButtonView(colors.border), { marginLeft: 20, marginTop: 10 }]} onPress={() => {
                        if (name && email && phone) {
                            saveUserInfo();
                        }
                        else {
                            Alert.alert("Complete All Information", "Please Fill Information Correctly!");
                        }
                    }}>
                        <Text style={[CommonStyles.VybeButtonText(colors.background), { fontFamily: 'Montserrat-Bold', fontSize: 15 }]}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            )}
            {screenNow == "Payment" && (
                <Payment 
                    handlerScreen={PaymentToLogs}
                />
            )}
            {screenNow == "SendLogs" && (
                <View style={{justifyContent:'center', alignItems:'center',height:'60%', marginTop:'-5%'}}>
                {showActivity ? <ActivityIndicator size={100} color={colors.border}/> : (
                    <View style={{justifyContent:'center', height: height*0.70}}>
                        <Text style={CommonStyles.Heading(colors.primary)}>AWSOME!</Text>
                        <Text style={CommonStyles.SubText(colors.primary)}>YOUR VYBE HAS BEEN SUCCESSFULLY SENT</Text>
                        <View style={CommonStyles.ParaView()}>
                            <Text style={CommonStyles.ParaText()}>You will receive your VybeForms for selection within 3 business days</Text>
                        </View>
                        <TouchableOpacity style={[CommonStyles.VybeButtonView(colors.border),{width: '60%', marginLeft: 20, marginTop: 30}]} onPress={async()=>{
                            await SensorDatabase.clearDatabase(blocks);
                            await SensorDatabase.updateBytesSaved(0);
                            await SensorDatabase.needToRefresh("true");
                            await AsyncStorage.setItem("@VybeForm","");
                            setShowActivity(true);
                            props.navigation.dangerouslyGetParent().navigate('TabWelcome');
                        }}>
                            <Text style={CommonStyles.VybeButtonText(colors.background)}>BACK TO VYBESMITH</Text>
                        </TouchableOpacity>
                    </View>
                )}
                </View>
            )}
            {screenNow == "ErrorWhileSendingVybes" && (
                    <View style={{justifyContent:'center', height: height*0.70}}>
                    <Text style={CommonStyles.Heading(colors.primary)}>Failed while Sending Vybes</Text>
                    <Text style={CommonStyles.SubText(colors.primary)}>VybeSmith server did not received the Vybes</Text>
                    <View style={CommonStyles.ParaView()}>
                        <Text style={CommonStyles.ParaText()}>Please Retry by pressing the button below</Text>
                    </View>
                    <TouchableOpacity style={[CommonStyles.VybeButtonView(colors.border),{width: '60%', marginLeft: 20, marginTop: 30}]} onPress={async()=>{
                        setShowActivity(true);
                        setScreenNow("SendLogs");
                    }}>
                        <Text style={CommonStyles.VybeButtonText(colors.background)}>SEND VYBES AGAIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyles.VybeButtonView(colors.border),{width: '60%', marginLeft: 20, marginTop: 30}]} onPress={async()=>{
                        await MailComposer.composeAsync({
                            subject: 'VybeSmith Sensor Data For User: '+name,
                            recipients: ["VybeSmith@gmail.com"],
                            body: `${device}\n${phone}\n${uuid}`,
                            attachments: [filePath]
                        }).then(res=>{
                            console.log("res = ",res);
                            manualOverride = true;
                            setScreenNow("SendLogs");
                            setShowActivity(false);
                        }).catch(err=>{
                            console.log(err);
                        });
                    }}>
                        <Text style={CommonStyles.VybeButtonText(colors.background)}>SEND VIA MAIL SERVICE</Text>
                    </TouchableOpacity>
                </View>                
            )}
            <View style={{marginBottom: 40}}></View>
        </ScrollView> 
    )
}
const styles = StyleSheet.create({
    input: (colors)=>{return{
        backgroundColor: colors.notification,
        width: '100%',
        borderRadius: 20,
        padding:15,
        alignSelf:'center',
        letterSpacing: 1,
        paddingLeft: 25
    }}
})
export default Mails;