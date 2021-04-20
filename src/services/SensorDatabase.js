import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter, Alert } from 'react-native'; 
import * as FileSystem from 'expo-file-system';

let open = false;
let db = null;

function checkDatabaseRunning(){
    return open;
}
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
async function startDataBase(){
    db = SQLite.openDatabase('db.sensorDB');
    open = true;
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS SensorData 
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                TimeRecord TEXT,
                BlockID TEXT,
                VibeName TEXT,
                AccMX REAL,
                AccMY REAL,
                AccMZ REAL,
                BaroPressure REAL,
                BaroRelativeAltitude REAL,
                AccX REAL,
                AccY REAL,
                AccZ REAL,
                AccGx REAL,
                AccGy REAL,
                AccGz REAL,
                RAlpha REAL,
                RBeta REAL,
                RGamma REAL,
                RRAlpha REAL,
                RRBeta REAL,
                RRGamma REAL,
                GyroX REAL,
                GyroY REAL,
                GyroZ REAL,
                MagnetoX REAL,
                MangetoY REAL,
                MagnetoZ REAL
            )`
        )
    },(err)=>{console.log(err)},(res)=>{
        
    });
    db.transaction(tx=>{
        tx.executeSql(`CREATE TABLE IF NOT EXISTS SelectedBlocks(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            BlockID TEXT,
            Package TEXT
        )`,(err)=>{
            console.log(err);
        },(res)=>{
            
        });
    })
}
function checkOks(arrayValues){
    return arrayValues.includes(true);
}
function countValues(SensorDataObject,ValueCount){
    const Keys = Object.keys(SensorDataObject);
    let count = 0;
    for(let key of Keys){
        count = count + SensorDataObject[key].length;
    }
    if(count === ValueCount){
        return true;
    }
    else{
        return false;
    }
}
async function saveData(SensorDataObject,ValuesCount){
    if(true){
        const BlockID = await getBlockID();
        const { AccelerometerData, BarometerData, MotionData, GyroscopeData, MagnetometerData, VibeName } = SensorDataObject;
        let row = [];
        for(let Index=0;Index<10;Index++){
            const DateTime = AccelerometerData[Index].timeStamp;
            row.push(DateTime);
            row.push("Block"+BlockID);
            row.push(VibeName == "" ? "Default" : VibeName);
            let x=0, y=0, z=0;
            let alpha=0, beta=0, gamma=0;
            // ACCELEROMETER DATA
            if(AccelerometerData[Index]){
                ({ x, y, z } = AccelerometerData[Index]);
                row.push(x);row.push(y);row.push(z);
            }
            else{
                row.push(0);row.push(0);row.push(0);
            }
            // BAROMETER DATA
            if(BarometerData[Index]){
                const { pressure, relativeAltitude } = BarometerData[Index];
                row.push(pressure);row.push(relativeAltitude);
            }
            else{
                row.push(0);row.push(0);
            }

            // MOTION SENSOR DATA
            if(MotionData[Index]){
                const { acceleration, accelerationIncludingGravity , rotation, rotationRate } = MotionData[Index];
                // ACCELERATION
                if(acceleration){
                    ({x, y, z} = acceleration);
                    row.push(x);row.push(y);row.push(z);    
                }
                else{
                    row.push(0);row.push(0);row.push(0);
                }
                // ACCELERATION INCLUDING GRAVITY
                if(accelerationIncludingGravity){
                    ({x, y, z} = accelerationIncludingGravity);
                    row.push(x);row.push(y);row.push(z);
                }
                else{
                    row.push(0);row.push(0);row.push(0);    
                }
                // ROTATION
                if(rotation){
                    ({alpha, beta, gamma} = rotation);
                    row.push(alpha);row.push(beta);row.push(gamma);
                }
                else{
                    row.push(0);row.push(0);row.push(0);
                }
                // ROTATION RATE
                if(rotationRate){
                    ({alpha, beta, gamma} = rotationRate);
                    row.push(alpha);row.push(beta);row.push(gamma);
                }
                else{
                    row.push(0);row.push(0);row.push(0);
                }
            }
            else{
                row.push(0);row.push(0);row.push(0);
                row.push(0);row.push(0);row.push(0);
                row.push(0);row.push(0);row.push(0);
                row.push(0);row.push(0);row.push(0);
            }

            // GYROSCOPE DATA
            if(GyroscopeData[Index]){
                ({x, y, z} = GyroscopeData[Index]);
                row.push(x);row.push(y);row.push(z);
            }
            else{
                row.push(0);row.push(0);row.push(0);
            }

            // MAGNETOMETER DATA
            if(MagnetometerData[Index]){
                ({x, y, z} = MagnetometerData[Index]);
                row.push(x);row.push(y);row.push(z);
            }
            else{
                row.push(0);row.push(0);row.push(0);
            }
            await saveToDatabase(row);
            row = [];
        }
        await setBlockID(BlockID+10);
        await lastBytesSaved().then(async (bytesSaved)=>{
            if(bytesSaved){
                await updateBytesSaved(bytesSaved+2080);
                DeviceEventEmitter.emit("updated-bytes",formatBytes(bytesSaved+2080));
            }
            else{
                await updateBytesSaved(2080);
                DeviceEventEmitter.emit("updated-bytes",formatBytes(2080));
            }
        });
    }
    else{
        throw "Values not Match The Count";
    }
}
async function saveToDatabase(row){
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO SensorData 
        (
            TimeRecord,
            BlockID,
            VibeName,
            AccMX,
            AccMY,
            AccMZ,
            BaroPressure,
            BaroRelativeAltitude,
            AccX,
            AccY,
            AccZ,
            AccGx,
            AccGy,
            AccGz,
            RAlpha,
            RBeta,
            RGamma,
            RRAlpha,
            RRBeta,
            RRGamma,
            GyroX,
            GyroY,
            GyroZ,
            MagnetoX,
            MangetoY,
            MagnetoZ
        ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, row,
          (txObj, resultSet) => {
              
          },
          (txObj, error) => console.log('Error', error))
      });
}
async function lastBytesSaved(){
    const bytesSaved = await AsyncStorage.getItem("@BytesSaved");
    if(bytesSaved){
        return parseFloat(bytesSaved);
    }
    else{
        return 0;
    }
}
async function updateBytesSaved(value){
    await AsyncStorage.setItem("@BytesSaved",value+"");
}
async function getBlockID(){
    const value = await AsyncStorage.getItem("@BlockID")
    if(value){
        return parseInt(value);
    }
    else{
        return 3000;
    }
}
async function setBlockID(ID){
    await AsyncStorage.setItem("@BlockID",ID+"");
}
async function fetchData(dateSelected, vibeSelected){
    if(vibeSelected){
        if(vibeSelected == "All Vibes") vibeSelected = "%"; 
    }
    else{
        vibeSelected = "%";
    }
    return new Promise((resolve, reject) => {
        if(dateSelected == "*"){
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM SensorData WHERE VibeName Like ?', [vibeSelected],
                  (txObj, { rows: { _array } }) => {
                    resolve(_array);
                },
                  (txObj, error) => {reject();}
                )
            });
        }
        else{
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM SensorData Where TimeRecord Like ? AND VibeName Like ? ', [dateSelected,vibeSelected],
                  (txObj, { rows: { _array } }) => {
                    resolve(_array);
                },
                  (txObj, error) => {reject();}
                )
            });
        }
    });
}
function combineBlocks(Blocks){
    const BlockArray = {};
    for(let block of Blocks){
        const { BlockID } = block;
        const keys = Object.keys(block);
        if(BlockArray[BlockID]){
            for(let k of keys){
                BlockArray[BlockID][k].push(block[k]);
            }
        }
        else{
            BlockArray[BlockID] = {};
            for(let k of keys){
                BlockArray[BlockID][k] = [block[k]];
            }
        }
    }
    const FinalArray = [];
    for(let block in BlockArray){
        delete BlockArray[block]["BlockID"];
        const ValueBlock = Object.assign(BlockArray[block],{"BlockID":block,"SelectedBlock":false});
        FinalArray.push(ValueBlock);
    }
    return FinalArray;
}
async function deleteBlock(BlockID){
    return new Promise((resolve, reject)=>{
        db.transaction(tx => {
            tx.executeSql('DELETE FROM SensorData WHERE BlockID = ? ', [BlockID],
              async(txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    await lastBytesSaved().then(async (bytesSaved)=>{
                        if(bytesSaved){
                            await updateBytesSaved(bytesSaved-2080);
                            DeviceEventEmitter.emit("updated-bytes",formatBytes(bytesSaved-2080));
                        }
                        else{
                            await updateBytesSaved(0);
                            DeviceEventEmitter.emit("updated-bytes",formatBytes(0));
                        }
                    });
                    resolve(true);
                }
                else{
                    resolve(false);
                }
              })
        });
    });
}
async function fetchAll(){
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM SensorData', [],
              (txObj, { rows: { _array } }) => {
                resolve(_array);
            },
              (txObj, error) => {reject();}
            )
        });
    });   
}
async function saveToFile(UniqueID, dataRecords, blocksAdded){
    let filePath = "";
    const headString = "UserId,Id,TimeRecord,BlockID,VibeName,AccMX,AccMY,AccMZ,BaroPressure,BaroRelativeAltitude,AccX,AccY,AccZ,AccGx,AccGy,AccGz,RAlpha,RBeta,RGamma,RRAlpha,RRBeta,RRGamma,GyroX,GyroY,GyroZ,MagnetoX,MangetoY,MagnetoZ"+"\n";
    const dataString = getContents(UniqueID,dataRecords, blocksAdded);
        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+"sensorData.csv",`${headString}${dataString}`,{
            encoding:FileSystem.EncodingType.UTF8
        });
        await FileSystem.getInfoAsync(FileSystem.documentDirectory+"sensorData.csv",{
            size:true
        }).then(async response=>{
            if(response.size>0){
                await updateBytesSaved(response.size);
            }
            filePath = response.uri;
        }).catch(err=>{
        console.log(err);
        return false;
    });
    return filePath;
}
function getContents(UniqueID,dataRecords,blocksAdded){
    let simpleString = "";
    for(let dataRecord of dataRecords){
        // IF BLOCK IN SELECTED BLOCK THEN...
        if(blocksAdded.includes(dataRecord["BlockID"])){
            simpleString = simpleString + UniqueID + "," + Object.values(dataRecord).join(",") + "\n";
        }
        // if(blocksAdded.includes(dataRecords[]))
    }
    return simpleString;
}
async function clearDatabase(blocksAdded){
    return new Promise(async(resolve, reject) => {
        for(let block of blocksAdded){
            // await db.transaction(tx => {
            //     tx.executeSql('DELETE FROM SensorData WHERE BlockID = ?', [block],
            //       (txObj, res) => {
            //         //   console.log(res);
            //     },
            //       (txObj, error) => {console.log(error)}
            //     )
            // });
            await db.transaction(tx => {
                tx.executeSql('DELETE FROM SelectedBlocks WHERE BlockID = ?', [block],
                  (txObj, res) => {
                    //   console.log(res);
                },
                  (txObj, error) => {console.log(error)}
                )
            });
        }
        resolve(true);
    });    
}
async function fetchVibesOnly(){
    return new Promise((resolve, reject)=>{
        db.transaction(tx => {
            tx.executeSql('SELECT DISTINCT VibeName FROM SensorData', [],
              async(txObj, resultSet) => {
                if (resultSet) {
                    const vibes = [];
                    for(let set of resultSet.rows._array){
                        vibes.push(set["VibeName"].toUpperCase());
                    }
                    resolve(vibes);
                }
                else{
                    reject();
                }
              })
        });
    });    
}
async function fetchDatesOnly(){
    return new Promise((resolve, reject)=>{
        db.transaction(tx => {
            tx.executeSql('SELECT TimeRecord FROM SensorData', [],
              async(txObj, resultSet) => {
                if (resultSet) {
                    const uniqueDates = [];
                    for(let result of resultSet.rows._array){
                        const { TimeRecord } = result;
                        result = new Date(TimeRecord).toDateString();
                        if(uniqueDates.indexOf(result)==-1) uniqueDates.push(result);
                    }
                    if(!uniqueDates.includes(new Date().toDateString())) uniqueDates.push(new Date().toDateString());
                    resolve(uniqueDates);
                }
                else{
                    reject();
                }
              })
        });
    });    
}
async function addBlockToSaveBlocks(BlockID, Package){
    await db.transaction(tx=>{
        tx.executeSql('DELETE FROM SelectedBlocks Where BlockID = (?)',[BlockID],((txObj, resultSet)=>{

        }),(txObj, err)=>{
            
        });
    });
    await db.transaction(tx=>{
        tx.executeSql('INSERT INTO SelectedBlocks(BlockID, Package) values (?,?)',[BlockID, Package],(txObj, resultSet)=>{
            return true;
        },(txObj, error)=>{
            return error;
        });
    })
}
async function getBlocksAdded(){
    return new Promise((resolve, reject)=>{
        // DISTINCT
        db.transaction(tx=>{
            tx.executeSql('SELECT * FROM SelectedBlocks',[],(txObject, { rows: { _array } })=>{
                resolve(_array);
            },(txObject, error)=>{
                reject(error);
            });
        })
    });
}
async function deleteSelectedBlock(BlockID){
    return new Promise((resolve, reject)=>{
        db.transaction(tx => {
            tx.executeSql('DELETE FROM SelectedBlocks WHERE BlockID = ? ', [BlockID],
              async(txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    resolve(true);
                }
                else{
                    resolve(false);
                }
              });
        });
    });    
}
async function needToRefresh(value){
    await AsyncStorage.setItem('@RefreshLogs',value);
}
async function checkRefresh(){
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('@RefreshLogs').then(res=>{
            if(res){
                if(res === "true"){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            }
            else{
                resolve(false);
            }
        });
    });
}
const SensorDatabase = {
    addBlockToSaveBlocks,
    saveData,
    formatBytes,
    startDataBase,
    checkDatabaseRunning,
    fetchData,
    fetchVibesOnly,
    combineBlocks,
    getBlocksAdded,
    deleteBlock,
    deleteSelectedBlock,
    saveToFile,
    fetchAll,
    fetchDatesOnly,
    clearDatabase,
    updateBytesSaved,
    needToRefresh,
    checkRefresh
}

export default SensorDatabase;
