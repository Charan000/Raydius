import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet ,TextInput, TouchableOpacity, Image, StatusBar, LayoutAnimation, Dimensions} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

import * as firebase from 'firebase';

const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

export default class LoginScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        email: "",
        password: "",
        errorMessage: null
    };

    handleLogin = () => {
        const {email, password} = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(email,password)
            .catch(error => this.setState({errorMessage: error.message}));
    };
    
    render() {
        LayoutAnimation.easeInEaseOut();
        return(
            <ScrollView style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>
                {/* <Image
                    source={require("../assets/raydiustransparent.png")}
                    // style={{marginTop:0, marginLeft:100}}
                    style = {styles.logoImage}
                ></Image> */}
                <View style={{marginVertical: '10%', alignSelf: 'center'}}>
                    <AutoHeightImage
                        width={SCREEN_WIDTH*0.9}
                        source={require("../assets/raydiusLogos/raydiusblackcropped.png")}
                    />
                </View>

                <Text style={styles.greeting}>{`Hello again.\nWelcome back.`}</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none"
                            onChangeText={email => this.setState({email})}
                            value={this.state.email}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <TextInput 
                            style={styles.input} 
                            secureTextEntry 
                            autoCapitalize="none"
                            onChangeText={password => this.setState({password})}
                            value={this.state.password}
                        ></TextInput>
                    </View>                    
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <Text style={{color: "#FFF", fontWeight: "500"}}> Sign in </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginVertical: 32}} onPress={() => this.props.navigation.navigate("Register")}>
                    <Text style={{color: "#414959",fontSize: 13}}>
                        New to Raydius ? <Text style={{ fontWeight: "500", color: "#0000FF" }}> Sign Up </Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        color: '#E5FAF8'
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height:40,
        fontSize: 15,
        color: "#161F3D"
    },button: {
        marginHorizontal: 30,
        backgroundColor: "#0000FF",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    logoImage: {
        flex:1,
        width: null,
        height: null,
        resizeMode: 'contain'
    }
});