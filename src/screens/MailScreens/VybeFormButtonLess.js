import React, {useEffect, useState} from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, Dimensions} from 'react-native';
import { useTheme } from '@react-navigation/native';
import CommonStyles from "../../themes/CommonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const vibes = [
    {
        package: "OCEANA EARRINGS",
        materials: ["Gold","Silver","Brass"],
        image: require('../../../assets/onBoard/OCEANA.jpg'),
        fee: 14.99,
        description:`Inspired by nature and the Coral of the Caribbean this beautiful earcuff will make a wonderful piece for you Vybed collection.`,
        selected:false
    },
    {
        package: "ICELANDER",
        materials: ["Diamond","Gold Plated","Silver","Brass"],
        image: require('../../../assets/onBoard/ICELANDER.jpg'),
        fee:14.99,
        description:`Inspired by nature and the Coral of the Caribbean this beautiful earcuff will make a wonderful piece for you Vybed collection.`,
        selected:false
    }
];
const VybeFormButtonLess = (props) => {
    const { width, height } = Dimensions.get('screen');
    const [packageSelected, setPackageSelected] = useState("");
    async function saveVybeForm(value){
        await AsyncStorage.setItem('@VybeForm',value);
    }
    useEffect(()=>{
        if(props.route.params){
            const { Package } = props.route.params;
            setPackageSelected(Package ? Package : "");
        }
        props.navigation.setOptions({
            headerShown: true,
            headerStyle:{
                height: 90
            },
            headerTransparent: true,
            headerTitle:"",
            headerRight: (()=>(
                <TouchableOpacity style={{width: width * 0.30}} onPress={props.navigation.goBack}>
                    <Text style={CommonStyles.SubText(colors.primary)}>{'< BACK'}</Text>
                </TouchableOpacity>
            )),
            headerLeft:(()=>(
                <View style={{width: width * 0.30, alignItems:'center'}}>
                    <Image 
                        source={require('../../../assets/svgs/vybeIcon.png')} 
                        style={{width: 40, height: 50}} 
                        resizeMode="contain"
                    />
                </View>
            ))
        });
    },[]);
    const { colors } = useTheme();
    return(
        <ScrollView style={[CommonStyles.MainView(colors.background),{marginTop: 80}]} showsVerticalScrollIndicator={false}>
            <Text style={CommonStyles.Heading(colors.primary)}>VYBEFORMS</Text>
            <Text style={CommonStyles.SubText(colors.primary)}>VYBES CATALOGUE</Text>
            <View style={CommonStyles.ParaView()}>
                <Text style={CommonStyles.ParaText(colors.primary)}>All prices are in USD</Text>
            </View>
            {vibes.map((vybe)=>(
                <View key={vybe.package} style={{ marginBottom: '5%', backgroundColor:colors.notification, borderRadius: 20}}>
                    <Image 
                        source={vybe.image} 
                        style={{width: '90%', height: 250, borderRadius: 20, alignSelf:'center'}}
                        resizeMode="contain"    
                    />
                    <Text style={[CommonStyles.SubText(colors.primary),{fontSize: 22}]}>{vybe.package}</Text>
                    <View style={CommonStyles.ParaView()}>
                        <Text style={CommonStyles.ParaText(colors.primary)}>{vybe.description}</Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <View style={{flex: 0.3, justifyContent:'center'}}> 
                            <Text style={CommonStyles.SubText(colors.primary)}>${vybe.fee}</Text>
                        </View>
                        {/* <View style={{flex: 0.7, alignItems:'flex-end'}}>
                            <TouchableOpacity style={[CommonStyles.VybeButtonView(colors.border),{width: width*0.40}]}
                                onPress={()=>{
                                    if(vybe.package === packageSelected){
                                        setPackageSelected("");
                                        saveVybeForm("");
                                    }
                                    else{
                                        // saveVybeForm(vybe.package);
                                        const { handlerSelect, BlockID } = props.route.params
                                        handlerSelect(BlockID, vybe.package);
                                        setPackageSelected(vybe.package);
                                    }
                                }}
                            >
                                <Text style={CommonStyles.VybeButtonText(colors.background)}>{
                                    packageSelected === vybe.package ? "REMOVE FROM BASKET" : "ADD TO BASKET"
                                }</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            ))}
            <View style={{marginBottom: 60}}></View>
        </ScrollView>
    )
}

export default VybeFormButtonLess;