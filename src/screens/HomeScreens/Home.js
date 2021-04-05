import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import CommonStyles from '../../themes/CommonStyles';
import { ScrollView } from 'react-native-gesture-handler';

const Home = (props) => {
    const {colors} = useTheme();
    return (
      <View style={CommonStyles.MainView(colors.background)}>
        <ScrollView>
            <View>
                <Text style={CommonStyles.Heading(colors.primary)}>{'WELCOME\nTO\nVYBESMITH'}</Text>
                <Text style={CommonStyles.SubText(colors.primary)}>WE ARE EXCITED TO HAVE YOU WITH US</Text>
                <View style={CommonStyles.ParaView()}>
                    <Text style={CommonStyles.ParaText(colors.primary)}>
                        Now you can have jewelry crafted for you that is truly yours. We use the motion sensors
                        from your phone to create beautiful pieces of jewelry that reflect your life and your
                        experience. {'\n\n'}Feel free to move,
                        dance, play or just have fun with it and see what your Vybe makes.{'\n\n'}
                        Simply tap and hold the record button to begin capturing your Vybe. Then tap and hold to end when you're done.  
                        Recordings are limited to 30 minute sessions.{'\n\n'}
                        Once you have recorded choose any of the VybeForms that you would like crafted with your
                        data. You will receive reference images of what your final form will look like. As a VybeSmith
                        on our platform you can craft as many pieces as you like.{'\n\n'}
                    </Text>
                </View>
                <TouchableOpacity style={CommonStyles.VybeButtonView(colors.border)} onPress={()=>{
                    props.navigation.dangerouslyGetParent().navigate('TabAmulance');
                }}>
                    <Text style={CommonStyles.VybeButtonText(colors.background)}>START VYBING</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </View>
    );
}
export default Home;