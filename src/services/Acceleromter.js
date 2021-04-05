import { Accelerometer } from 'expo-sensors';
import { DeviceEventEmitter } from 'react-native';
let subscription = null;
let remove = false;
let running = false;
let isAvailable = false;
let data = [];

const _slow = () => {
    Accelerometer.setUpdateInterval(3000);
};
async function startService(){
    if(isAvailable){
        console.log("Accelerometer Sevice Started!");
        running = true;
        subscription = Accelerometer.addListener(accelerometerData => {
            accelerometerData = Object.assign(accelerometerData,{timeStamp:new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })})
            data.push(accelerometerData);
            console.log("Accelerometer Data Array Length: "+data.length);
            if(data.length == 10){
                DeviceEventEmitter.emit("accelerometer-data");
            }
        });
        remove = true;
        _slow();            
    }
    else{
        console.log("Accelerometer Sensor Is Not Available!");
    }
}
async function stopService(){
    console.log("Accelerometer Sevice Stopped!");
    running = false;
    // remove && Accelerometer.removeAllListeners();
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
    await Accelerometer.isAvailableAsync().then(res=>{
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

const AccelerometerService = {
    startService,
    stopService,
    getData,
    checkRunning,
    checkAvailable
}

export default AccelerometerService;