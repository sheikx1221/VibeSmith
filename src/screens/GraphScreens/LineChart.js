import React,{useState} from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import CommonStyles from '../../themes/CommonStyles';
import { useTheme } from '@react-navigation/native';
import { LineChart } from "react-native-chart-kit";
import CircleImage from '../../components/CircleImage';

let sensorsName = ["Barometer","Acceleration","Acceleration wG","Rotation","Rotation Rate","Gyroscope","Magnetometer","Accelerometer"];
let sensorImages = {
    "Accelerometer":require('../../../assets/vybeSensors/accelerometer.png'), 
    "Barometer": require('../../../assets/vybeSensors/barometer.png'),
    "Acceleration": require('../../../assets/vybeSensors/device.png'),
    "Acceleration wG": require('../../../assets/vybeSensors/device.png'),
    "Rotation": require('../../../assets/vybeSensors/device.png'),
    "Rotation Rate": require('../../../assets/vybeSensors/device.png'),
    "Gyroscope": require('../../../assets/vybeSensors/gyroscope.png'),
    "Magnetometer": require('../../../assets/vybeSensors/magnetometer.png')
}
const LineChartScreen = (props) => {
    const {width, height} = Dimensions.get('screen');
    const { colors,dark } = useTheme();
    const [sensorNow,setSensorNow] = useState("Accelerometer");
    const [axisNow, setAxisNow] = useState("X");
    const item = props.item;
    function getHMS(value){
        const D = new Date(value);
        let time = D.toTimeString().split(' ')[0].match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/);

        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join ('');
    }
    function executeNext(){
        let value = "";
        if(sensorsName.length === 0){
            resetNext();
        }
        value = sensorsName.shift();
        setSensorNow(value);
    }
    function resetNext(){
        sensorsName = ["Accelerometer","Barometer","Acceleration","Acceleration wG","Rotation","Rotation Rate","Gyroscope","Magnetometer"];
        setSensorNow(null);
    }
    function getSecondsOnly(value){
        value = value.split(":")[2];
        value = value.split(" ")[0];
        return value+"s";
    }
    function getArrayHMS(values){
        const times = [];
        for(let value of values){
            times.push(getSecondsOnly(getHMS(value)));
        }
        return times;
    }
    function AxisList(){
        switch(sensorNow){
            case "Accelerometer":
                return ["X","Y","Z","All"];
            case "Barometer":
                return ["Pressure","Altitude", "All"];
            case "Acceleration":
                return ["X","Y","Z","All"];
            case "Acceleration wG":
                return ["X","Y","Z","All"];
            case "Rotation":
                return ["Alpha","Beta","Gamma","All"];
            case "Rotation Rate":
                return ["Alpha","Beta","Gamma","All"];
            case "Gyroscope":
                return ["X","Y","Z","All"];
            case "Magnetometer":
                return ["X","Y","Z","All"];
        }
    }
    function manipulateDataForGood(objectArray){
        for(let index in objectArray){
            if(objectArray[index] === null){
                objectArray[index] = [0,0,0,0,0,0,0,0,0,0];
            }
            else{
                for(let value in objectArray[index]){
                    if(objectArray[index][value] === null) objectArray[index][value] = 0
                }
            }
        }
        return objectArray;
    }

    function seperateDatasets({...item}){
        delete item["BlockID"];
        delete item["TimeRecord"]; 
        
        switch(sensorNow){
            case "Accelerometer":
                let {AccMX, AccMY, AccMZ} = item;
                ({AccMX, AccMY, AccMZ} = manipulateDataForGood({AccMX, AccMY, AccMZ}));
                if(axisNow === "All"){
                    return [{data: AccMX},{data: AccMY},{data: AccMZ}];
                }
                else{
                    return axisNow === "X" ? [{data: AccMX}] : axisNow === "Y" ? [{data: AccMY}] : [{data: AccMZ}];
                }
            case "Barometer":
                let {BaroPressure, BaroRelativeAltitude} = item;
                ({BaroPressure, BaroRelativeAltitude} = manipulateDataForGood({BaroPressure, BaroRelativeAltitude}));
                if(axisNow === "All"){
                    return [{data: BaroPressure},{data: BaroRelativeAltitude}];
                }
                else{
                    return axisNow === "Pressure" ? [{data: BaroPressure}] : [{data: BaroRelativeAltitude}];
                }
            case "Acceleration":
                let {AccX, AccY, AccZ} = item;
                ({AccX, AccY, AccZ} = manipulateDataForGood({AccX, AccY, AccZ}))
                if(axisNow === "All"){
                    return [{data: AccX},{data: AccY},{data: AccZ}];
                }
                else{
                    return axisNow === "X" ? [{data: AccX}] : axisNow === "Y" ? [{data: AccY}] : [{data: AccZ}];
                }
            case "Acceleration wG":
                let { AccGx, AccGy, AccGz } = item;
                ({AccGx, AccGy, AccGz} = manipulateDataForGood({AccGx, AccGy, AccGz}))
                if(axisNow === "All"){
                    return [{data: AccGx},{data: AccGy},{data: AccGz}];
                }
                else{
                    return axisNow === "X" ? [{data: AccGx}] : axisNow === "Y" ? [{data: AccGy}] : [{data: AccGz}];
                }  
            case "Rotation":
                let { RAlpha, RBeta, RGamma } = item;
                ({RAlpha, RBeta, RGamma} = manipulateDataForGood({RAlpha, RBeta, RGamma}))
                if(axisNow === "All"){
                    return [{data: RAlpha},{data: RBeta},{data: RGamma}];
                }
                else{
                    return axisNow === "Alpha" ? [{data: RAlpha}] : axisNow === "Beta" ? [{data: RBeta}] : [{data: RGamma}];
                } 
            case "Rotation Rate":
                let { RRAlpha, RRBeta, RRGamma } = item;
                ({RRAlpha, RRBeta, RRGamma} = manipulateDataForGood({RRAlpha, RRBeta, RRGamma}))
                if(axisNow === "All"){
                    return [{data: RRAlpha},{data: RRBeta},{data: RRGamma}];
                }
                else{
                    return axisNow === "Alpha" ? [{data: RRAlpha}] : axisNow === "Beta" ? [{data: RRBeta}] : [{data: RRGamma}];
                }       
            case "Gyroscope":
                let { GyroX, GyroY, GyroZ } = item;
                ({GyroX, GyroY, GyroZ} = manipulateDataForGood({GyroX, GyroY, GyroZ}))
                if(axisNow === "All"){
                    return [{data: GyroX},{data: GyroY},{data: GyroZ}];
                }
                else{
                    return axisNow === "X" ? [{data: GyroX}] : axisNow === "Y" ? [{data: GyroY}] : [{data: GyroZ}];
                }  
            case "Magnetometer":
                let { MagnetoX, MangetoY, MagnetoZ } = item;
                ({MagnetoX, MangetoY, MagnetoZ} = manipulateDataForGood({MagnetoX, MangetoY, MagnetoZ}))
                if(axisNow === "All"){
                    return [{data: MagnetoX},{data: MangetoY},{data: MagnetoZ}];
                }
                else{
                    return axisNow === "X" ? [{data: MagnetoX}] : axisNow === "Y" ? [{data: MangetoY}] : [{data: MagnetoZ}];
                } 
        }
        return(
            [{
                data:[2.3,4.5,3.4,3.5,4.5,4.5,4.6,5.6,7.8]
            }]
        );
    }
    function getAxisStyle(AxisName){
        if(axisNow === "All"){
            return CommonStyles.ActiveAxis(colors.primary)
        }
        else{
            if(AxisName === axisNow){
                return CommonStyles.ActiveAxis(colors.primary)
            }
            else{
                return CommonStyles.InActiveAxis(colors.notification)
            }
        }
    }
    return (
        <View style={{flex:1, width:width*0.88, alignSelf:'center'}}>
            <LineChart
                data={{
                    labels: getArrayHMS(item.TimeRecord),
                    datasets: seperateDatasets(item)
                }}
                width={width*0.88}
                height={220}
                chartConfig={{
                backgroundColor: colors.notification,
                backgroundGradientFrom: colors.notification,
                backgroundGradientTo: colors.notification,
                // backgroundColor: dark ? "#482ff7" : "#e26a00",
                // backgroundGradientFrom: dark ? "#2d6cdf" : "#fb8c00",
                // backgroundGradientTo: dark ? "#46c3db" : "#ffa726",
                decimalPlaces: 3,
                color: (opacity = 10)=>`rgba(0,0,0,${opacity})`,
                labelColor: (opacity = 10)=>`rgba(0,0,0,${opacity})`,
                // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                // labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16,
                    alignSelf:'center',
                    width: width*0.88
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "0",
                    stroke: colors.primary
                }
                }}
                withDots={false}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={false}
                withHorizontalLabels={false}
                withVerticalLabels={true}
                bezier
                style={{
                    alignSelf:'center',
                    width: width*0.88,
                    paddingRight: 20,
                }}
            />
            <View style={{flexDirection:'row', width:width*0.85, alignSelf:'center', borderRadius:20}}>
                <View style={{width: '45%',justifyContent: 'center', alignItems: 'center', flexDirection:'row'}}>
                    <CircleImage 
                        requiredImage={sensorImages[sensorNow]}
                        TextLabel={""}
                        onPressFunction={executeNext}
                        ImageBackground={colors.primary}
                    />
                    <Text style={[CommonStyles.SubText(colors.primary),{marginLeft: 5, textAlignVertical: 'center', marginTop: -5, letterSpacing: 1}]}>VYBE STATS</Text>
                </View>
                <View style={{width: '55%',flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop: -10}}>
                    {AxisList().map((Axis)=>(
                        <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPress={()=>setAxisNow(Axis)} key={Axis}>
                            <Text style={getAxisStyle(Axis)}>{Axis.replace("X","A").replace("Y","K").replace("Z","L")}</Text>
                        </TouchableOpacity>                        
                    ))}
                </View>
            </View>
        </View>
    )
}

export default LineChartScreen;