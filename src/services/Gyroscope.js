import { Gyroscope } from 'expo-sensors'
import { DeviceEventEmitter } from 'react-native';
let subscription = null;
let data = [];
let running = false;
let isAvailable = false;

const _slow = () => {
    Gyroscope.setUpdateInterval(3000);
};
async function startService(){
    if(isAvailable){
        console.log("Gyroscope Sevice Started!");
        running = true;
        subscription = Gyroscope.addListener(GyroscopeData => {
            data.push(GyroscopeData);
            console.log("Gyroscope Data Array Length: "+data.length);
            if(data.length == 10){
                DeviceEventEmitter.emit("gyroscope-data");
            }
        });
        _slow();    
    }
    else{
        console.log("Gyroscope Sensor Is Not Available!");
    }
}
async function stopService(){
    console.log("Gyroscope Sevice Stopped!");
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
    await Gyroscope.isAvailableAsync().then(res=>{
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
const GyroscopeService = {
    startService,
    stopService,
    getData,
    checkRunning,
    checkAvailable
}

export default GyroscopeService;