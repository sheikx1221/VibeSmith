import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, FlatList, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import CommonStyles from '../../themes/CommonStyles';
import { useTheme, useIsFocused } from '@react-navigation/native';
import SensorDatabase from '../../services/SensorDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = (props) => {
    const { width, height } = Dimensions.get('screen');
    const { colors } = useTheme();
    const [activity, showActivity] = useState(true);
    const [blocks, setBlocks] = useState([]);
    const isFocused = useIsFocused();

    useEffect(()=>{
        async function completeStartCart(){
            if(!SensorDatabase.checkDatabaseRunning()){
                await SensorDatabase.startDataBase();
            }
            await SensorDatabase.getBlocksAdded().then(blocksAdded=>{
                setBlocks(blocksAdded);
            }).catch(err=>{
                console.log(err);
            });
            showActivity(false);
        }
        if(isFocused) completeStartCart();
    },[isFocused]);

    return(
        <View style={CommonStyles.MainView(colors.background)}>
            <Text style={CommonStyles.Heading(colors.primary)}>{'YOUR\nVYBE\nBASKET'}</Text>
            <Text style={CommonStyles.SubText(colors.primary)}>NOW IT’S TIME FOR VYBE FORMING</Text>
            <View style={CommonStyles.ParaView()}>
                <Text style={CommonStyles.ParaText(colors.primary)}>Each Vybe you’ve bottled will generate multiple
                VybeForms which will be submitted to you via
                email. There you can select your material, for
                example fold or silver. Your price will be calculated
                for the final crafting of your beautifully unique
VybeForm.</Text>
            </View>
            {activity ? (
                <View style={{justifyContent:'center', alignItems: 'center'}}>
                    <ActivityIndicator size={60} color={colors.primary} style={{alignSelf: 'center'}}/>
                </View>
            ):(
                <View style={{flex:1, marginTop: '10%'}}>
                    {blocks.length === 0 && (
                        <Text style={CommonStyles.SubText(colors.primary)}>No Records Found.{'\n'}Add some items to your cart first.</Text>
                    )}
                    {blocks.map((item)=>(
                        <View key={item.id} style={{
                            width: "100%",
                            alignSelf: 'center',
                            backgroundColor: colors.notification,
                            padding: 10,
                            borderRadius: 25,
                            marginBottom: 10
                        }}>
                            <Text style={CommonStyles.SubText(colors.primary)}>{item.BlockID.replace("Block", "VYBE ")}</Text>
                            <View style={CommonStyles.ParaView()}>
                                <Text style={CommonStyles.ParaText(colors.primary)}>{item.Package}</Text>
                            </View>
                        </View>
                    ))}
                    {blocks.length > 0 && (
                        <TouchableOpacity style={[CommonStyles.VybeButtonView(colors.border), { width: width * 0.40, marginLeft: 15 }]}
                            onPress={() => {
                                props.onPressHandler("UserInfo")
                            }}
                        >
                            <Text style={[CommonStyles.VybeButtonText(colors.background), { paddingLeft: 30, paddingRight: 30 }]}>CHECKOUT</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}

export default Cart;