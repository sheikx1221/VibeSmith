import { StatusBar } from 'expo-status-bar';
import React,{useEffect,useState} from 'react';
import * as Font from 'expo-font';
import { View, TouchableOpacity, Image, Text} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons, Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import { DefaultTheme, NavigationContainer, DarkTheme } from '@react-navigation/native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const HomeSVG = require('./assets/svgs/home.png');
const CartSVG = require('./assets/svgs/cart.png');
const StartSVG = require('./assets/svgs/startVybe.png');
const TaskListSVG = require('./assets/svgs/tasklist.png');
const InfoSVG = require('./assets/svgs/info.png');

import N_LightTheme from './src/themes/LightTheme';
import N_DarkTheme from './src/themes/DarkTheme';
import Home from './src/screens/HomeScreens/Home';
import Detection from './src/screens/HomeScreens/Detection';
import SensorData from './src/screens/GraphScreens/SensorData';
import OnBoard from './src/screens/LogInScreens/OnBoard';
import VybeForm from './src/screens/MailScreens/VybeForm';
import MailUp from './src/screens/MailScreens/Mails';
import Cart from './src/screens/MailScreens/Cart';
import AccelerometerSensor from './src/screens/SensorScreens/Accelerometer';
import BaromerterSensor from './src/screens/SensorScreens/Barometer';
import DeviceMotionSensor from './src/screens/SensorScreens/DeviceMotion';
import GyroscopeSensor from './src/screens/SensorScreens/Gyroscope';
import MagnetometerSensor from './src/screens/SensorScreens/Magnetometer';
import PedometerSensor from './src/screens/SensorScreens/Pedometer';

const HomeStack = createStackNavigator();
const DataStack = createStackNavigator();
const DetectionStack = createStackNavigator();
const VybeFormStack = createStackNavigator();
const MailStack = createStackNavigator();
const OnBoardStack = createStackNavigator();
const BottomNavigation = createBottomTabNavigator();

function CommonStackOptions(props, theme, hide){
  return {
    headerShown: false,
    headerMode: 'none',
    headerTitle:hide?null:"VIBESMITH",
    headerStyle:{
      height:0,
    },
    headerTitleStyle:{
      color:theme.primary,
      marginLeft:15
    },
    headerTransparent:true,
    headerBackImage:(()=>(
      <MaterialCommunityIcons name="menu-open" color={theme.primary} size={25}/>
    )),
    headerRight:(()=>(
      <>
        {hide ? (
          <View></View>
        ) : (
            <View style={{flexDirection: 'row-reverse'}}>
              <TouchableOpacity style={{marginRight:5}} onPress={()=>{
                switch(theme.Stack){
                  case 0:
                    props.navigation.navigate('CartHome');
                    break;
                  case 1:
                    props.navigation.navigate('CartDetect');
                    break;
                  case 2:
                    props.navigation.navigate('CartData');
                    break;
                  case 3:
                    props.navigation.navigate('CartMail');
                    break;
                };
              }}>
                <Entypo name="shopping-cart" color={theme.primary} size={25} style={{marginRight: 10}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                  if(theme.Mode === "light"){
                    theme.ToggleMode('dark');
                  }
                  else{
                    theme.ToggleMode('light');
                  }
                }}>
                {theme.Mode === "light" ? (
                  <Entypo name="light-up" size={25} color={theme.primary} style={{marginRight: 10}}/>
                ) : (
                  <MaterialIcons name="nightlight-round" size={25} color={theme.primary} style={{marginRight: 10}}/>
                )}
              </TouchableOpacity>
            </View>
            )}
      </>
    ))
  }
}
function _HomeStack(props, Mode, handlerModeUpdate){
  let theme = Mode === "dark" ? N_DarkTheme.colors : N_LightTheme.colors;
  theme = Object.assign(theme, {Mode: Mode, ToggleMode: handlerModeUpdate, Stack: 0});
  return(
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} options={CommonStackOptions(props, theme)}/>
      <HomeStack.Screen name="Accelerometer" component={AccelerometerSensor} options={CommonStackOptions(props,theme)}/>
      <HomeStack.Screen name="Barometer" component={BaromerterSensor} options={CommonStackOptions(props,theme)} />
      <HomeStack.Screen name="Motion" component={DeviceMotionSensor} options={CommonStackOptions(props,theme)} />
      <HomeStack.Screen name="Gyroscope" component={GyroscopeSensor} options={CommonStackOptions(props,theme)} />
      <HomeStack.Screen name="Magnetometer" component={MagnetometerSensor} options={CommonStackOptions(props,theme)} />
      <HomeStack.Screen name="Pedometer" component={PedometerSensor} options={CommonStackOptions(props,theme)} />
      <HomeStack.Screen name="CartHome" component={Cart} options={CommonStackOptions(props,theme,true)} />
    </HomeStack.Navigator>
  );
}
function _DetectionStack(props, Mode, handlerModeUpdate){
  let theme = Mode === "dark" ? N_DarkTheme.colors : N_LightTheme.colors;
  theme = Object.assign(theme, {Mode: Mode, ToggleMode: handlerModeUpdate, Stack: 1});

  return(
    <DetectionStack.Navigator>
      <DetectionStack.Screen name="Detection" component={Detection} options={CommonStackOptions(props,theme)}/>
      <DetectionStack.Screen name="CartDetect" component={Cart} options={CommonStackOptions(props,theme,true)} />
    </DetectionStack.Navigator>
  )
}
function _DataStack(props, Mode, handlerModeUpdate){
  let theme = Mode === "dark" ? N_DarkTheme.colors : N_LightTheme.colors;
  theme = Object.assign(theme, {Mode: Mode, ToggleMode: handlerModeUpdate, Stack: 2});

  return(
    <DataStack.Navigator>
      <DataStack.Screen name="Data" component={SensorData} options={CommonStackOptions(props,theme)}/>
      <DataStack.Screen name="VybeForms" component={VybeForm} options={CommonStackOptions(props, theme)}/>
      <DataStack.Screen name="CartData" component={Cart} options={CommonStackOptions(props,theme,true)} />
    </DataStack.Navigator>
  );
}
function _VybeFormStack(props, Mode, handlerModeUpdate){
  let theme = Mode === "dark" ? N_DarkTheme.colors : N_LightTheme.colors;
  theme = Object.assign(theme, {Mode: Mode, ToggleMode: handlerModeUpdate, Stack: 2});

  return(
    <VybeFormStack.Navigator>
      <VybeFormStack.Screen name="MainScreen" component={VybeForm} options={CommonStackOptions(props, theme)}/>
    </VybeFormStack.Navigator>
  )
}
function _MailStack(props, Mode, handlerModeUpdate){
  let theme = Mode === "dark" ? N_DarkTheme.colors : N_LightTheme.colors;
  theme = Object.assign(theme, {Mode: Mode, ToggleMode: handlerModeUpdate, Stack: 3});

  return(
    <MailStack.Navigator>
      <MailStack.Screen name="Mail" component={MailUp} options={CommonStackOptions(props,theme)}/>
      <MailStack.Screen name="CartMail" component={Cart} options={CommonStackOptions(props,theme,true)} />
    </MailStack.Navigator>
  );
}
function _OnBoardStack(props){
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? N_DarkTheme.colors : N_LightTheme.colors;
  function OnScrreen(){
    return(<OnBoard handlerUpdate={props.handlerUpdate}/>)
  }
  return(
    <OnBoardStack.Navigator>
      <OnBoardStack.Screen name="OnBoard" component={OnScrreen} options={CommonStackOptions(props,theme,true)}/>
    </OnBoardStack.Navigator>
  );  
}
const _BottomTabs = ({Mode, handlerModeUpdate}) => {
  const theme = Mode === "dark" ? N_DarkTheme.colors : N_LightTheme.colors;
  return(
    <BottomNavigation.Navigator tabBarOptions={{
      activeTintColor:theme.background,
      inactiveTintColor:theme.border,
      labelStyle:{
        fontSize:12,
        fontWeight:'bold'
      },
      style:{
        borderTopLeftRadius:90,
        borderTopRightRadius:90,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        borderBottomEndRadius:10,
        marginBottom:1,
        backgroundColor:theme.primary
      },
      labelPosition:'below-icon',
      showLabel:false,
      keyboardHidesTabBar:true,
    }}
    >
      <BottomNavigation.Screen name="TabMain" children={(props)=>_HomeStack(props, Mode, handlerModeUpdate)} options={{
          tabBarLabel:"HOME",
          tabBarIcon:({color})=>(
            <Image source={HomeSVG} style={{width: 20, height: 20}} resizeMode="contain"/>
          )
        }}
      />
      <BottomNavigation.Screen name="TabList" children={(props)=>_DataStack(props, Mode, handlerModeUpdate)} options={{
          tabBarLabel:"HOME",
          tabBarIcon:({color})=>(
            <Image source={TaskListSVG} style={{width: 20, height: 20}} resizeMode="contain"/>
          )
        }}
      />
      <BottomNavigation.Screen name="TabAmulance" children={(props)=>_DetectionStack(props, Mode, handlerModeUpdate)} options={{
        tabBarLabel:"HOME",
        tabBarIcon:({color})=>(
          <View style={{padding:3, marginBottom: 40}}>
              <Image source={StartSVG} style={{width: 80, height: 80}} resizeMode="contain"/>
          </View>
        )
      }}
      />
      <BottomNavigation.Screen name="TabNotifications" children={(props)=>_VybeFormStack(props, Mode, handlerModeUpdate)} options={{
        tabBarLabel:"HOME",
        tabBarIcon:({color})=>(
          <View style={{padding:3}}>
            <Image source={InfoSVG} style={{width: 20, height: 20}} resizeMode="contain"/>
          </View>
        )
      }}
      />
      <BottomNavigation.Screen name="TabLocationn" children={(props)=>_MailStack(props, Mode, handlerModeUpdate)} options={{
        tabBarLabel:"HOME",
        tabBarIcon:({color})=>(
          <View style={{padding:3}}>
            <Image source={CartSVG} style={{width: 20, height: 20}} resizeMode="contain"/>
          </View>
        )
      }}
      />
    </BottomNavigation.Navigator>
  );
}
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnBoard, setShowOnBoard] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState('light');
  const scheme = useColorScheme();
  function updateMode(Value){
    setMode(Value);
  }
  function updateOnBoard(){
    setShowOnBoard(false);
    AsyncStorage.setItem("@OnBoard","Shown")
  }
  function ImageComponent(){
    return (
      <View style={{flex:1}}>
        <Image source={scheme === "dark" ? require("./assets/SplashDark.png") : require("./assets/Splash.png")}
          style={{width:"100%", height:"100%"}}
          resizeMode="contain"
        />
      </View>
    )
  }
  useEffect(()=>{
    async function loadFonts(){
      await Font.loadAsync({
        'Montserrat': require("./assets/fonts/Montserrat/Montserrat-Regular.ttf"),
        'Montserrat-SemiBold': require('./assets/fonts/Montserrat/Montserrat-SemiBold.ttf'),
        'Montserrat-Bold': require('./assets/fonts/Montserrat/Montserrat-Bold.ttf'),
        'Fascinate': require('./assets/fonts/Fascinate/Fascinate-Regular.ttf')
      }).then(res=>{
        setLoaded(true)
      }).catch(Err=>{
        setLoaded(true);
        console.log(Err);
      }); 
    }

    loadFonts();
    AsyncStorage.getItem("@OnBoard").then(value=>{
      if(value){
        if(value === "Shown"){
          setIsLoading(false);
        }
        else{
          setIsLoading(false);
          setShowOnBoard(true);
        }
      }
      else{
        setShowOnBoard(true);
        setIsLoading(false);
      }
    })
  },[])
  const Dark = {
    ...DarkTheme,
    colors:N_DarkTheme.colors
  }
  const Light = {
    ...DefaultTheme,
    colors:N_LightTheme.colors
  }
  return (
    <>
      {!loaded ? null : 
      <AppearanceProvider>
        <StatusBar hidden={true}/>
        <NavigationContainer theme={mode === 'dark' ? Dark : Light}>
        {(isLoading) ? (
            <ImageComponent />
          ):(
            <>
              {showOnBoard ? (
                <_OnBoardStack handlerUpdate={updateOnBoard}/>
              ) : (
                <_BottomTabs handlerModeUpdate={updateMode} Mode={mode}/>
              )}
            </>
        )}
        </NavigationContainer>
      </AppearanceProvider>
      }
      <Toast ref={(ref)=>Toast.setRef(ref)}/>
    </>
  );
}

