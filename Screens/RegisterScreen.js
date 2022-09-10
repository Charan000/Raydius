import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet ,TextInput, TouchableOpacity, Image, StatusBar, BackHandler, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AutoHeightImage from 'react-native-auto-height-image';
import Fire from "../Fire";

const {width} = Dimensions.get('window');
const SCREEN_WIDTH = width;

// 19-03-2020
import * as firebase from 'firebase'

export default class RegisterScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        name: "",
        email: "",
        password: "",
        errorMessage: null
    };

    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(userCredentials => {
                Fire.shared.addUserDocument();
                return userCredentials.user.updateProfile({
                    displayName: this.state.name
                });
            })
            .catch(error => this.setState({ errorMessage: error.message}));
    };

    render() {
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

                <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}> 
                    {/* <Icon name={'arrow-back'} size={32} color="#fff"/> */}
                    {/* <Icon name="md-arrow-round-back" size={30} color="#fff" /> */}
                    <Icon name="ios-arrow-back" size={30} color="#000" />
                </TouchableOpacity>



                <Text style={styles.greeting}>{`Hello.\nSign up to get started.`}</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Name</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none"
                            onChangeText={name => this.setState({name})}
                            value={this.state.name}
                        ></TextInput>
                    </View>
                    
                    <View style={{ marginTop: 32 }}>
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

                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={{color: "#FFF", fontWeight: "500"}}> Sign up </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{alignSelf: "center", marginTop: 32}} 
                    onPress={() => this.props.navigation.navigate("Login")}
                >
                    <Text style={{color: "#414959",fontSize: 13}}>
                        Already registered ? <Text style={{ fontWeight: "500", color: "#0000FF" }}> Sign in </Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    greeting: {
        color: '#000000',
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center",
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
    },
    back: {
        position: "absolute",
        top: 25,
        left: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(21, 22, 48, 0.1)",
        alignItems: "center",
        justifyContent: "center"
    }

});