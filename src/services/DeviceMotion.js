import { DeviceMotion } from 'expo-sensors'
import { DeviceEventEmitter } from 'react-native';
let subscription = null;
let data = [];
let running = false;
let isAvailable = false;

const _slow = () => {
    DeviceMotion.setUpdateInterval(3000);
};
async function startService(){
    if(isAvailable){
        console.log("Motion Sevice Started!");
        running = true;
        subscription = DeviceMotion.addListener(motionData => {
            data.push(motionData);
            console.log("Device Motion Data Array Length: "+data.length);
            if(data.length == 10){
                DeviceEventEmitter.emit("motion-data");
            }
        });
        _slow();    
    }
    else{
        console.log("Device Motion Sensor Is Not Available!");
    }
}
async function stopService(){
    console.log("Motion Sevice Stopped!");
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
    await DeviceMotion.isAvailableAsync().then(res=>{
        if(res){
            isAvailable = true;
            response = 10;
        }
        else{
            response = 0;
        }
    }).catch(err=>{
        response = 0;
    });
    return response;
}
const MotionService = {
    startService,
    stopService,
    getData,
    checkRunning,
    checkAvailable
}

export default MotionService;