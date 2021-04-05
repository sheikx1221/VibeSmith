import { Barometer } from 'expo-sensors'
import { DeviceEventEmitter } from 'react-native';
let subscription = null;
let data = [];
let running = false;
let isAvailable = false;

const _slow = () => {
    Barometer.setUpdateInterval(3000);
};
async function startService(){
    if(isAvailable){
        console.log("Barometer Sevice Started!");
        running = true;
        subscription = Barometer.addListener(barometerData => {
            data.push(barometerData);
            console.log("Barometer Data Array Length: "+data.length);
            if(data.length == 10){
                DeviceEventEmitter.emit("barometer-data");
            }
        });
        _slow();    
    }
    else{
        console.log("Barometer Sensor Is Not Available!");
    }
}
async function stopService(){
    console.log("Barometer Sevice Stopped!");
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
    await Barometer.isAvailableAsync().then(res=>{
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
const BarometerService = {
    startService,
    stopService,
    getData,
    checkRunning,
    checkAvailable
}

export default BarometerService;