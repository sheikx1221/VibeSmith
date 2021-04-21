import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import CommonStyles from '../../themes/CommonStyles';
import { TextInputMask } from 'react-native-masked-text';
import { ErrorTypes, getErrorTypeFromCode } from './ErrorTypes';
import { useIsFocused } from '@react-navigation/native';
import { TOKEN_API, CHARGE_API, AUTH_KEY } from '@env';
const Payment = (props) => {
    const { colors } = useTheme();
    const [cardHolder, setCardHolder] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvc, setCVC] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [showActivity, setActivity] = useState(false);
    const [payment, setPayment] = useState(ErrorTypes.STARTING);
    const isFocused = useIsFocused();

    useEffect(()=>{
        if(!isFocused) return;
        setPayment(ErrorTypes.STARTING);
        setActivity(false);
    },[isFocused]);

    function splitExpiryDate(Type){
        if(Type == "Month") return parseInt(expiryDate.split('/')[0]);
        return parseInt(expiryDate.split('/')[1]);
    }

    async function completePayment() {
        setActivity(true);
        createToken().then(token=>{
            if (token.err) throw token.err;
            else {
                performPayment(token.result).then(result => {
                    if (!result.result || result.err) throw result.err;
                    setPayment(ErrorTypes.PAYMENT_SUCESSFULL);
                    setActivity(false);
                });
            }
        }).catch(err=>{
            Alert.alert('Payment Cannot Be Processed', getErrorTypeFromCode(err.message ? err.message : err));
            setPayment(ErrorTypes.PAYMENT_FAILED);
            setActivity(false);
        });
    }

    async function createToken(){
        const body = {
            authKey: AUTH_KEY,
            number: cardNumber,
            exp_month: splitExpiryDate('Month'),
            exp_year: splitExpiryDate('Year'),
            cvc: cvc,
            // optional
            // name: 'Test User',
            currency: 'usd',
            // addressLine1: '123 Test Street',
            // addressLine2: 'Apt. 5',
            // addressCity: 'Test City',
            // addressState: 'Test State',
            // addressCountry: 'Test Country',
            // addressZip: '55555',
        }
        let data = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type':'application/json'
            }
        }
        const promise = await fetch(TOKEN_API, data).then(res=>res.json());
        return promise;
    }
    async function performPayment(token){
        const body = {
            authKey: AUTH_KEY,
            amount: 1499,
            token: token
        }
        let data = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type':'application/json'
            }
        }
        const promise = await fetch(CHARGE_API, data).then(res=>res.json());
        return promise;
    }
    return(
        <View style={CommonStyles.MainView(colors.background)}>
            <View>
                <Text style={CommonStyles.SubText(colors.primary)}>CARD HOLDER NAME</Text>
                <TextInput 
                    value={cardHolder}
                    onChangeText={(text)=>setCardHolder(text)}
                    style={styles.input(colors)}
                    placeholder={"ENTER TITLE ON YOUR CARD"}
                    placeholderTextColor={colors.primary}
                />
                <Text style={CommonStyles.SubText(colors.primary)}>CARD NUMBER</Text>
                <TextInputMask 
                    type="credit-card"
                    value={cardNumber}
                    onChangeText={(text)=>setCardNumber(text)}
                    style={styles.input(colors)}
                    placeholder={"ENTER CREDIT CARD"}
                    placeholderTextColor={colors.primary}
                />
                <Text style={CommonStyles.SubText(colors.primary)}>CVC</Text>
                <TextInputMask 
                    type="custom"
                    options={{
                        mask: "999"
                    }}
                    value={cvc}
                    onChangeText={(text) => {
                        setCVC(text);
                    }}
                    placeholder={"ENTER CVC"}
                    placeholderTextColor={colors.primary}
                    style={styles.input(colors)}
                    keyboardType="number-pad"
                />
                <Text style={CommonStyles.SubText(colors.primary)}>CARD EXPIRY DATE</Text>
                <TextInputMask 
                    type="custom"
                    options={{
                        mask: "99/99",
                        validator: function(value){
                        }
                    }}
                    value={expiryDate}
                    onChangeText={(text) => {
                        const values = text.split("/");
                        if(parseInt(values[0]) <= 12 && parseInt(values[0]) >= 0){
                            setExpiryDate(text);
                        }
                        else{
                            setExpiryDate("");
                        }
                    }}
                    placeholder={"ENTER CARD EXPIRY DATE"}
                    placeholderTextColor={colors.primary}
                    style={styles.input(colors)}
                    keyboardType="number-pad"                    
                />
            </View>
            <TouchableOpacity style={CommonStyles.VybeButtonView(colors.border)} onPress={()=>{
                if(payment === ErrorTypes.PAYMENT_SUCESSFULL){
                    props.handlerScreen();
                }
                else{
                    const values = [cardHolder, cardNumber, cvc, expiryDate];
                    for(let value of values){
                        if(value === ""){
                            Alert.alert("Incomplete Fields","Please Complete All Fields Before Adding Payment.");
                            return;
                        }
                    }
                    completePayment();
                    // setTimeout(() => {
                    //     setPayment(ErrorTypes.PAYMENT_SUCESSFULL);
                    // }, 1000);
                }
            }}>
                {showActivity ? 
                    <ActivityIndicator 
                        size={'large'}
                        color={colors.background}
                        style={{alignSelf:'center', padding: '5%'}}
                    />
                : 
                    <Text style={CommonStyles.VybeButtonText(colors.background)}>{payment}</Text>
                }
            </TouchableOpacity>
            <View style={{marginBottom: 60}}></View>
        </View>
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
export default Payment;