import { Magnetometer } from 'expo-sensors'
import { DeviceEventEmitter } from 'react-native';
let subscription = null;
let data = [];
let running = false;
let isAvailable = false;

const _slow = () => {
    Magnetometer.setUpdateInterval(3000);
};
async function startService(){
    if(isAvailable){
        console.log("Magnetometer Sevice Started!");
        running = true;
        subscription = Magnetometer.addListener(MagnetometerData => {
            data.push(MagnetometerData);
            console.log("Magnetometer Data Array Length: "+data.length);
            if(data.length == 10){
                DeviceEventEmitter.emit("magnetometer-data");
            }
        });
        _slow();    
    }
    else{
        console.log("Magnetometer Sensor Is Not Available!");
    }
}
async function stopService(){
    console.log("Magnetometer Sevice Stopped!");
    running = false;
    subscription && subscription.remove();
    data = [];
    subscription = null;
}
async function getData(){
    let sortedData = [...data];
    data = [];
    return sortedData;
}
function checkRunning(){
    return running;
}
async function checkAvailable(){
    let response = null;
    await Magnetometer.isAvailableAsync().then(res=>{
        if(res){
            response = 10;
            isAvailable = true;
        }
        else{
            response = 0;
        }
    }).catch(err=>{
        response = 0;
    });
    return response;
}
const MagnetometerService = {
    startService,
    stopService,
    getData,
    checkRunning,
    checkAvailable
}

export default MagnetometerService;