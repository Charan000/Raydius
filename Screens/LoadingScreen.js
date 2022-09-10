import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';

import firebase from "firebase";
import Fire from "../Fire";


// 19-03-2020

export default class LoadingScreen extends Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "App" : "Auth");
        });
    }

    render() {
        // #2761BEFF
        const colorLayer = <View style={[StyleSheet.absoluteFill, {backgroundColor:"#2761BEFF" }]} />

        const whiteLayer = <View style={[StyleSheet.absoluteFill, {backgroundColor:"#FFF" }]} />

        return (
            <View style={styles.container}>
                {colorLayer}
                <Image 
                    source={require('../assets/raydiusLogos/raydiuswhite.png')}
                    // source={require('../assets/Raydius_logo_1.png')} 
                    style={styles.logoImage}
                />
            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    centered:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    logoImage: {
        flex: 1,
        width: '95%',
        height: '30%',
        resizeMode: 'contain' }
});


