import React,{useState,useEffect,useCallback} from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions, FlatList, Image } from 'react-native';
import CommonStyles from '../../themes/CommonStyles';
import { useTheme } from '@react-navigation/native';
import SensorDatabase from '../../services/SensorDatabase';
import GraphBody from './GraphBody';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

let dateofList = "All Dates";
let vibeOfList = "All Vibes";

const SensorData = (props) => {
    const isFocused = useIsFocused();
    const { colors, dark } = useTheme();
    const [sensorData, setSensorData] = useState([]);
    const [checked, setChecked] = useState(false);
    const {width, height} = Dimensions.get('screen');
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("All Dates");
    const [refreshing, setRefreshing] = useState(false);
    const [vibes, setVibes] = useState([]);
    const [selectedVibe, setSelectedVibe] = useState("All Vibes");

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        setChecked(false);
        await updateList(dateofList, vibeOfList).then(()=>{
            setRefreshing(false);
            setChecked(true);
        });
    }, []);
    useEffect(()=>{
        updateList("All Dates","All Vibes");
        fetchUniqueDates();
        fetchUniqueVibes();
    },[]);
    useEffect(()=>{
        async function checkRefresh(){ 
            await SensorDatabase.checkRefresh().then(async res=>{
                if(res){
                    onRefresh();
                    await SensorDatabase.needToRefresh("false");
                }
            });         
        }   
        if(isFocused) checkRefresh();
    },[isFocused]);
    async function updateList(DateSelected, VibeSelected){
        if(DateSelected == "All Dates"){
            await fetchSensorData("*",VibeSelected).then(()=>{
                setSelectedDate(DateSelected);
                setSelectedVibe(VibeSelected);
            });    
        }
        else{
            const dateSplit = DateSelected.split(" ");
            dateSplit.splice(3, 0, "%%:%%:%%");  
            await fetchSensorData(dateSplit.join(" "),VibeSelected).then(()=>{
                setSelectedDate(DateSelected);
                setSelectedVibe(VibeSelected);
            });    
        }
    }
    async function fetchSensorData(selectedDate, selectedVibe){
        if(!SensorDatabase.checkDatabaseRunning()){
            await SensorDatabase.startDataBase();
        }
        await SensorDatabase.fetchData(selectedDate, selectedVibe).then(resultSet=>{
            resultSet = SensorDatabase.combineBlocks(resultSet);
            setSensorData(resultSet);
            setChecked(true);
        }).catch(err=>{
            setSensorData([]);
            setChecked(true);
        });
    }
    async function fetchUniqueVibes(){
        if(!SensorDatabase.checkDatabaseRunning()){
            await SensorDatabase.startDataBase();
        }
        let vibes = await SensorDatabase.fetchVibesOnly();
        if(vibes.length == 0){
            vibes = ["All Vibes"];
        }
        else{
            vibes.push("All Vibes");
        }
        setVibes(vibes);    
    }
    async function fetchUniqueDates(){
        if(!SensorDatabase.checkDatabaseRunning()){
            await SensorDatabase.startDataBase();
        }
        let dates = await SensorDatabase.fetchDatesOnly();
        if(dates.length == 0){
            dates = [new Date().toDateString(),"All Dates"];   
        }
        else{
            dates.push("All Dates");
        }
        setDates(dates);
    }    
    function renderRightActions(progress, dragX, BlockID){
        return(
            <View style={{ 
                alignItems:'center', 
                justifyContent:'center',
                width:width*0.40,
                alignSelf:'center',
                padding:20,
                marginTop:"-5%"
            }}>
                <TouchableOpacity style={{flexDirection:'row', borderBottomWidth:0.3,padding:4}} onPress={async()=>{
                    await SensorDatabase.deleteBlock(BlockID);
                    await SensorDatabase.deleteSelectedBlock(BlockID);
                    onRefresh();
                }}>
                    <Text style={CommonStyles.LowText(colors.primary)}>Delete Block</Text>
                    <AntDesign name="delete" size={25} color={colors.primary}/>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={CommonStyles.MainView(colors.background)}>
            <Text style={CommonStyles.Heading(colors.primary)}>{'YOUR\nAMAZING\nVYBES'}</Text>
            <View style={{flexDirection: 'row'}}>
                <Text style={CommonStyles.SubText(colors.primary)}>SEE ALL YOUR BOTTLED VYBES BELOW</Text>
                <TouchableOpacity style={{justifyContent:'center', alignItems:'center'}} onPress={()=>onRefresh()}>
                        <Ionicons name="reload" size={15} color={colors.primary}/>
                </TouchableOpacity>
            </View>
            <View style={CommonStyles.ParaView()}>
                <Text style={CommonStyles.ParaText(colors.primary)}>Tap on the Vybe name to open it.</Text>
            </View>
            {selectedDate ? (
                <>
                {checked ? (
                    <>
                    {sensorData.length > 0 ? (
                        <FlatList 
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={sensorData}
                            keyExtractor={(item, index)=>index+""}
                            renderItem={({index,item})=>(
                                <Swipeable
                                    renderRightActions={(progress, dragX)=>renderRightActions(progress, dragX, item.BlockID)}
                                >
                                    <GraphBody item={item} navigation={props.navigation}/>
                                </Swipeable>
                            )}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            ListFooterComponent={()=>(
                                <View style={{marginBottom: 60}}>
                                    {/* {sensorData.length>0 && (
                                        <TouchableOpacity style={CommonStyles.VybeButtonView(colors.border)}>
                                            <Text style={CommonStyles.VybeButtonText(colors.background)}>Continue</Text>
                                        </TouchableOpacity>
                                    )} */}
                                </View>
                            )}
                            ListHeaderComponent={()=>(
                                <View style={{marginTop: 10,marginBottom: 10,backgroundColor: colors.notification, borderRadius: 20, height:100, width: width*0.88}}>
                                    <Text style={CommonStyles.SubText(colors.primary)}>Filters</Text>
                                    {/* DATES FILTER */}
                                    <View style={{flexDirection:'row', marginBottom:'0%', marginLeft:25, marginTop:5}}>
                                        <View style={{flex:0.53}}>
                                            <Text style={[CommonStyles.ParaText(colors.primary),{marginRight:0}]}>Showing Vybes for Date:</Text>
                                        </View>
                                        <View style={{flex:0.2, marginTop:-5}}>
                                            <Picker
                                                selectedValue={selectedDate}
                                                style={[CommonStyles.ParaText(colors.primary),{marginLeft:0, width:180, marginTop:-15}]}
                                                onValueChange={async(itemValue, itemIndex) => {
                                                    await updateList(itemValue, vibeOfList);
                                                    dateofList = itemValue;
                                                }}
                                                mode="dropdown"
                                                >
                                                {dates.map((value)=>(
                                                    <Picker.Item label={value} value={value} key={value}/>
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                    {/* VYBES FILTER */}
                                    <View style={{flexDirection:'row', marginBottom:'0%'}}>
                                        <View style={{flex:0.565}}>
                                            <Text style={[CommonStyles.ParaText(colors.primary),{marginLeft: 25}]}>Select Vybes to Show :</Text>
                                        </View>
                                        <View style={{flex:0.2}}>
                                            <Picker
                                                selectedValue={selectedVibe}
                                                style={[CommonStyles.ParaText(colors.primary),{marginLeft:0, width:180, marginTop:-15}]}
                                                onValueChange={async(itemValue, itemIndex) => {
                                                    vibeOfList = itemValue;
                                                    await updateList(dateofList, itemValue);
                                                }}
                                                mode="dropdown"
                                                >
                                                {vibes.map((value)=>(
                                                    <Picker.Item label={value} value={value} key={value}/>
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>                                        
                                </View>
                            )}
                        />
                    ):(
                        <View>
                            {/* WHEN NO VYBES FOUND SCREEN NEEDED */}
                            <View style={{ marginTop: 10, marginBottom: 10, backgroundColor: colors.notification, borderRadius: 20, height: 100, width: width * 0.88 }}>
                                <Text style={CommonStyles.SubText(colors.primary)}>Filters</Text>
                                {/* DATES FILTER */}
                                <View style={{ flexDirection: 'row', marginBottom: '0%', marginLeft: 25, marginTop: 5 }}>
                                    <View style={{ flex: 0.53 }}>
                                        <Text style={[CommonStyles.ParaText(colors.primary), { marginRight: 0 }]}>No Vybes for Date :</Text>
                                    </View>
                                    <View style={{ flex: 0.2, marginTop: -5 }}>
                                        <Picker
                                            selectedValue={selectedDate}
                                            style={[CommonStyles.ParaText(colors.primary), { marginLeft: -25, width: 170 ,marginTop: -15 }]}
                                            onValueChange={async (itemValue, itemIndex) => {
                                                await updateList(itemValue, vibeOfList);
                                                dateofList = itemValue;
                                            }}
                                            mode="dropdown"
                                            
                                        >
                                            {dates.map((value) => (
                                                <Picker.Item label={value} value={value} key={value} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                {/* VYBES FILTER */}
                                <View style={{ flexDirection: 'row', marginBottom: '0%' }}>
                                    <View style={{ flex: 0.565 }}>
                                        <Text style={[CommonStyles.ParaText(colors.primary), { marginLeft: 25 }]}>No Vybes for name :</Text>
                                    </View>
                                    <View style={{ flex: 0.2 }}>
                                        <Picker
                                            selectedValue={selectedVibe}
                                            style={[CommonStyles.ParaText(colors.primary), { marginLeft: -25, width: 170, marginTop: -15 }]}
                                            onValueChange={async (itemValue, itemIndex) => {
                                                vibeOfList = itemValue;
                                                await updateList(dateofList, itemValue);
                                            }}
                                            mode="dropdown"
                                        >
                                            {vibes.map((value) => (
                                                <Picker.Item label={value} value={value} key={value} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    </>
                ):(
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator 
                            size={60}
                            color={colors.primary}
                            style={{alignSelf:'center', justifyContent:'center'}}
                        />
                    </View>
                )}
                </>
            ):(
                <View>
                    <View style={{flexDirection:'row'}}>
                    <View style={{flex:0.5}}>
                            <Text style={CommonStyles.SubText(colors.primary)}>No Vybes Found for </Text>
                    </View>
                    <View style={{flex:0.5}}>
                            <Picker
                                selectedValue={selectedDate || new Date().toDateString()}
                                style={[CommonStyles.SubText(colors.primary),{marginLeft:0, marginTop:-8}]}
                                onValueChange={async(itemValue, itemIndex) => {
                                    await updateList(itemValue);
                                    dateofList = itemValue;
                                }}
                                mode="dropdown"
                                >
                                {dates.map((value)=>(
                                    <Picker.Item label={value} value={value} key={value}/>
                                ))}
                            </Picker>
                        </View> 
                    </View>
                    <Image 
                    source={
                        dark ? require("../../../assets/sensors/guageOnDark.png"): require("../../../assets/sensors/guageOnLight.png")
                    } 
                    style={{
                        width:"80%",
                        height:"80%",
                        alignSelf:'center',
                        // backgroundColor:colors.primary
                    }}
                    resizeMode="contain"
                    />
                    <Text style={CommonStyles.SubText(colors.primary)}>Activate Sensors to Auto Enable Logs</Text>
                </View>
            )}
        </View>
    )
}
export default SensorData;