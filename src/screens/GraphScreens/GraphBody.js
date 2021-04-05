import React,{useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import LineChartScreen from './LineChart';
import SensorDatabase from '../../services/SensorDatabase';
import { Octicons, Entypo } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import CommonStyles from '../../themes/CommonStyles';

const GraphBody = (props) => {
    const [selectedBlock, setSelectedBlock] = useState(false);
    const { colors } = useTheme();
    const item = props.item; 
    const { width, height } = Dimensions.get('screen');
    const [savedBlocks, setSavedBlocks] = useState([]);

    function getHMS(value){
        const D = new Date(value);
        let time = D.toTimeString().split(' ')[0].match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/);

        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join ('');
    }
    const selectBlock = async(BlockID, PackageSelect) => {
        await SensorDatabase.addBlockToSaveBlocks(BlockID, PackageSelect);
        await SensorDatabase.getBlocksAdded().then(blocksFound=>{
            setSavedBlocks(blocksFound);
        }).catch(err=>{
            console.log(err);
        });
        
        Toast.show({
            text1: BlockID.replace("Block","Vybe ") + " has been added to cart!",
            text2:'Continue to Select as many vybes as you like',
            type:'success',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
            bottomOffset: 40,
        });
    }
    async function deleteBlock(BlockID){
        await SensorDatabase.deleteSelectedBlock(BlockID)
        await SensorDatabase.getBlocksAdded().then(blocksFound=>{
            setSavedBlocks(blocksFound);
        }).catch(err=>{
            console.log(err);
        });

        Toast.show({
            text1: BlockID.replace("Block","Vybes ") + " has been removed from cart!",
            text2:'Vybes are made to be reflected',
            type:'info',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
            bottomOffset: 40,
        });
    } 
    useEffect(()=>{
        async function getBlocksFromDatabase(){
            await SensorDatabase.getBlocksAdded().then(blocksFound=>{
                setSavedBlocks(blocksFound);
            }).catch(err=>{
                console.log(err);
            });
        }
        getBlocksFromDatabase();
    },[])
    function checkIfSelected(BlockID){
        for(let saved of savedBlocks){
            if(saved.BlockID === BlockID){
                return true;
            }
        }
    }
    function packageSelectedWithBlock(BlockID){
        const value = savedBlocks.find((item)=>{
            if(item.BlockID === BlockID) return true;
        });
        if(value){
            return value.Package;
        }
        return undefined;
    }
    return(
        <Collapse style={{marginBottom:10, backgroundColor: colors.notification, borderRadius: 40}}>
            <CollapseHeader>
                <View style={{
                    height:50,   
                    width:width * 0.88,
                    alignSelf:'center',
                }}>
                    <View style={{flexDirection: "row", height: 50, width:width * 0.88}}>
                        <View style={{flex: 0.6, justifyContent:'center'}}>
                        {/* + "\nFrom "+getHMS(item.TimeRecord[0])+" To "+getHMS(item.TimeRecord[item.TimeRecord.length-1]) */}
                            <Text style={[CommonStyles.SubText(colors.primary),{textAlignVertical:'center',fontFamily: 'Montserrat-Bold'}]}>{item.VibeName[0].toUpperCase() + " " + item.BlockID.replace("Block","VYBE ")}</Text>
                        </View>
                        <TouchableOpacity 
                            style={{
                                flex:0.4,
                                backgroundColor: colors.border,
                                borderRadius: 60,
                                height: 49,
                                justifyContent:'center',
                                alignItems:'center',
                                width:'100%'
                            }}
                            onPress={()=>{
                                if(checkIfSelected(item.BlockID)){
                                    deleteBlock(item.BlockID);
                                }
                                else{
                                    const packageSelected = packageSelectedWithBlock(item.BlockID);
                                    props.navigation.navigate('VybeForms',{
                                        handlerSelect: selectBlock,
                                        BlockID: item.BlockID,
                                        Package: packageSelected
                                    });
                                    // selectBlock(item.BlockID);
                                }
                            }}>
                                <Text style={[CommonStyles.SubText(colors.background), {width:'100%',textAlign:'center',fontSize: 11, marginRight:20}]}>
                                    {!checkIfSelected(item.BlockID)?(
                                        "SELECT VYBEFORM"
                                    ):(
                                        "REMOVE VYBEFORM"
                                    )}
                                </Text>
                        </TouchableOpacity>                       
                    </View>
                </View>
            </CollapseHeader>
            <CollapseBody>
                <LineChartScreen 
                    item={item}
                />
            </CollapseBody>
        </Collapse>
    );

}

export default GraphBody;