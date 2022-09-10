import React, { Component } from 'react';

import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Fire from "../Fire";

import ImagePicker from 'react-native-image-picker';

const firebase = require("firebase");
require("firebase/firestore");

export default class PostScreen extends Component {
    state = {
        text: "",
        image: null
    };

    componentDidMount() {
        this.getPhotoPermission();
    }

    getPhotoPermission = async () => {
        if(Platform.OS === 'ios') {
            // alert("Hi this is ios platform"); //working



        } else {
            //alert("Hi this is android platform");

            const granted = await request(PERMISSIONS.ANDROID.CAMERA);

            //console.log(granted)

        }
    };

    handlePost = () => {
        Fire.shared
            .addPost({ text: this.state.text.trim(), localUri: this.state.image })
            .then(ref => {
                this.setState({ text: "", image: null });
                this.props.navigation.goBack();
            })
            .catch(error => {
                alert(error);
            });
    };

    pickImage = async () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        
        // ImagePicker.launchImageLibrary(options, (response) => {
        //     console.log('Response = ', response);
      
        //     if (response.didCancel) {
        //         console.log('User cancelled image picker');
        //     } else if (response.error) {
        //         console.log('ImagePicker Error: ', response.error);
        //     } else if (response.customButton) {
        //         console.log('User tapped custom button: ', response.customButton);
        //         alert(response.customButton);
        //     } else {
        //         const source = { uri: response.uri };
        //         console.log('response', JSON.stringify(response));
        //         this.setState({
        //             // filePath: response,
        //             // fileData: response.data,
        //             image: response.uri,
        //       });
        //     }
        // });


        ImagePicker.showImagePicker(options, (response) => {
            //console.log('Response = ', response);
          
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                //console.log('response', JSON.stringify(response));
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
            
                this.setState({
                    image: response.uri,
                });
            }
        });

    }
    
    render() {
        return (
            // <View style={styles.container}>
            //     <Text>Post Screen</Text>
            // </View>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="md-arrow-back" size={24} color="#D8D9DB" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePost}>
                        <Text style={{ fontWeight: "500" }}>Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    {/* <Image source={require("../assets/Raydius.jpg")} style={styles.avatar}></Image> */}
                    <TextInput
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={4}
                        style={{ flex: 1 }}
                        placeholder="Want to share something?"
                        onChangeText={text => this.setState({ text })}
                        value={this.state.text}
                    ></TextInput>
                </View>

                <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                    <Icon name="md-camera" size={32} color="#D8D9DB" />
                </TouchableOpacity>

                <View style={{ marginHorizontal: 32, marginTop:32, height: 150 }}>
                    <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }}></Image>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
});




/*
check(PERMISSIONS.ANDROID.CAMERA)
    .then(result => {
        switch (result) {
        case RESULTS.UNAVAILABLE:
            console.log(
            'This feature is not available (on this device / in this context)',
            );
            break;
        case RESULTS.DENIED:
            console.log(
            'The permission has not been requested / is denied but requestable',
            );
            break;
        case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
        case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
    })
    .catch(error => {
        // …
    });

*/