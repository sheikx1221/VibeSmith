import AccelerometerService from './Acceleromter';
import BarometerService from './Barometer';
import DeviceMotionService from './DeviceMotion';
import GyroscopeService from './Gyroscope';
import MagnetometerService from './Magnetometer';
import SensorDatabase from './SensorDatabase';
import { DeviceEventEmitter, Alert } from 'react-native';

let eventsRegistered = false;
let ValueCount = 0;
let saving = false;
let _VibeName = "";

let SensorDataObject = {
    AccelerometerData:[],
    BarometerData:[],
    MotionData:[],
    GyroscopeData:[],
    MagnetometerData:[],
}

function checkToSave(){
    const Keys = Object.keys(SensorDataObject);
    let count = 0;
    for(let key of Keys){
        count = count + SensorDataObject[key].length;
    }
    if(count == ValueCount && saving == false){
        saving = true;
        return true;
    }
    else{
        return false;
    }
}
async function saveDataInBlocks(){
    if(!SensorDatabase.checkDatabaseRunning()){
        await SensorDatabase.startDataBase();
    }
    await SensorDatabase.saveData(Object.assign(SensorDataObject,{VibeName: _VibeName}),ValueCount).then(()=>{
        SensorDataObject = {
            AccelerometerData:[],
            BarometerData:[],
            MotionData:[],
            GyroscopeData:[],
            MagnetometerData:[]
        }
        saving = false;
    }).catch(err=>{
        console.log(err);
        Alert.alert("Error While Counting Records","While Fetching Vybes from Sensors, We noticed the values to be a bit off\nDon't worry, a reload can solve the sensor issue");
        DeviceEventEmitter.emit("stop-service");
        stopAllSensors();
    })
}
async function registerEvents(){
    DeviceEventEmitter.addListener("accelerometer-data",async ()=>{
        SensorDataObject.AccelerometerData =  await AccelerometerService.getData();
        console.log("Acceleromter Data Received Length: "+SensorDataObject.AccelerometerData.length);
        if(checkToSave()){
            saveDataInBlocks();
        }
    });
    DeviceEventEmitter.addListener("barometer-data",async ()=>{
        SensorDataObject.BarometerData = await BarometerService.getData();
        console.log("Barometer Data Received Length: "+SensorDataObject.BarometerData.length);
        if(checkToSave()){
            console.log("In Barometer: Save is True");
            saveDataInBlocks();
        }
    });
    DeviceEventEmitter.addListener("motion-data",async ()=>{
        SensorDataObject.MotionData = await DeviceMotionService.getData();
        console.log("Motion Data Received Length: "+SensorDataObject.MotionData.length);
        if(checkToSave()){
            console.log("In Motion Data: Save is True");
            saveDataInBlocks()
        }
    });
    DeviceEventEmitter.addListener("gyroscope-data",async ()=>{
        SensorDataObject.GyroscopeData = await GyroscopeService.getData();
        console.log("Gyroscope Data Received Length: "+SensorDataObject.GyroscopeData.length);
        if(checkToSave()){
            console.log("In Gyroscope: Save is True");
            saveDataInBlocks()
        }
    });
    DeviceEventEmitter.addListener("magnetometer-data",async ()=>{
        SensorDataObject.MagnetometerData = await MagnetometerService.getData();
        console.log("Magnetometer Data Received Length: "+SensorDataObject.MagnetometerData.length);
        if(checkToSave()){
            console.log("In Magnetometer: Save is True");
            saveDataInBlocks()
        }
    });
}
async function removeEvents(){
    DeviceEventEmitter.removeListener("accelerometer-data",()=>{
        console.log("Accelerometer Listener Removed!");
    });
    DeviceEventEmitter.removeListener("barometer-data",()=>{
        console.log("Barometer Listener Removed!");
    });
    DeviceEventEmitter.removeListener("motion-data",()=>{
        console.log("Motion Listener Removed!");
    });
    DeviceEventEmitter.removeListener("gyroscope-data",()=>{
        console.log("Gyroscope Listener Removed");
    });
    DeviceEventEmitter.removeListener("magnetometer-data",()=>{
        console.log("Magnetometer Listener Removed");
    });
}
async function startAllSensors(VibeName){
    if(VibeName){
        _VibeName = VibeName;
        console.log(VibeName + " Set In Main Service");
    }
    ValueCount = ValueCount + await AccelerometerService.checkAvailable();
    ValueCount = ValueCount + await BarometerService.checkAvailable();
    ValueCount = ValueCount + await GyroscopeService.checkAvailable();
    ValueCount = ValueCount + await MagnetometerService.checkAvailable();
    ValueCount = ValueCount + await DeviceMotionService.checkAvailable();

    if(!eventsRegistered){
        await registerEvents();
        eventsRegistered = true;
    }

    await AccelerometerService.startService();
    await BarometerService.startService();
    await DeviceMotionService.startService();
    await GyroscopeService.startService();
    await MagnetometerService.startService();
}
async function stopAllSensors(){
    await AccelerometerService.stopService();
    await BarometerService.stopService();
    await DeviceMotionService.stopService();
    await GyroscopeService.stopService();
    await MagnetometerService.stopService();
    ValueCount = 0;
    await removeEvents();
}
function checkSensorStatus(Sensor){
    switch(Sensor){
        case "Accelerometer":
            return AccelerometerService.checkRunning();
        case "Barometer":
            return BarometerService.checkRunning();
        case "Motion":
            return DeviceMotionService.checkRunning();
        case "Gyroscope":
            return GyroscopeService.checkRunning();
        case "Magnetometer":
            return MagnetometerService.checkRunning();
        default: 
            return false;
    }
}
const MainService = {
    startAllSensors,
    stopAllSensors,
    checkSensorStatus,
    formatBytes:SensorDatabase.formatBytes
}

export default MainService;