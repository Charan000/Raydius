import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TextInput, Platform, TouchableOpacity, LayoutAnimation,  ActivityIndicator, YellowBox } from 'react-native';
import ScaledImage from '../src/scaledImage/ScaledImage';
import Icon from 'react-native-vector-icons/Ionicons';

import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Fire from "../Fire";

import ImagePicker from 'react-native-image-picker';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import {Picker} from '@react-native-community/picker';

import firestore from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

const firebase = require("firebase");
require("firebase/firestore");

YellowBox.ignoreWarnings([ 'useNativeDriver' ]);


const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;


export default class AddMarkerDataScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        category: 'others',
        PickerSelectCategory:"others",
        description: "",
        image: "no image",
        publisher_uid: null,
        title:"",
        website_link:"",
        latitude: 0.0,
        longitude: 0.0,

        isVisible1: false,
        isVisible2: false,
        chosenDate: '',
        startDate: '',
        endDate: '',
        loading: false
    }

    componentDidMount() {
        this.getPhotoPermission();
    }

    getPhotoPermission = async () => {
        if(Platform.OS === 'ios') {

        } else {
            const granted = await request(PERMISSIONS.ANDROID.CAMERA);
        }
    };

    setStateEmpty() {
        this.setState({
            category: 'others',
            PickerSelectCategory:"others",
            description: "",
            image: "no image",
            publisher_uid: null,
            title:"",
            website_link: "",
            latitude: 0.0,
            longitude: 0.0,
    
            isVisible1: false,
            isVisible2: false,
            chosenDate: '',
            startDate: '',
            endDate: '',
            loading: false
        });
    }

    handleMarkerPost = () => {
        if( this.state.title==="" || this.state.startDate==='' || this.state.endDate==='' ) {
            alert("Please fill the fields with *");
        }
        else {

            this.setState({
                loading: true
            });

            Fire.shared
            .addMarkerPost({ 
                description: this.state.description ? this.state.description.trim() : "no description",
                localUri: this.state.image,
                category: this.state.category.trim(),
                title: this.state.title.trim(),
                website_link: this.state.website_link ? this.state.website_link.trim() : "no website",
                // coordinates: new firebase.firestore.GeoPoint(this.state.latitude, this.state.longitude),
                coordinates: {latitude: this.state.latitude, longitude: this.state.longitude},
                start_date: this.state.startDate,
                end_date: this.state.endDate
            })
            .then(ref => {
                this.setStateEmpty();
                this.props.navigation.goBack();
            })
            .catch(error => {
                alert(error);
            });
        }
    };


    pickImage = async () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {          
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    image: response.uri,
                });
                this._image.updateImage();
            }
        });

    }

    refresh = (lat, long) => {
        this.setState({
            latitude : lat,
            longitude: long
        });
    }

    handleStartPicker = (datetime) => {
        this.setState({
            isVisible: false,
            startDate: moment(datetime).format('MMMM, Do YYYY HH:mm')
        })
    }


    showStartPicker = () => {
        this.setState({
            isVisible1: true
        })
    }

    hideStartPicker = () => {
        this.setState({
            isVisible1: false,
        })
    }


    handleEndPicker = (datetime) => {
        this.setState({
            isVisible2: false,
            endDate: moment(datetime).format('MMMM, Do YYYY HH:mm')
        })
    }

    showEndPicker = () => {
        this.setState({
            isVisible2: true
        })
    }

    hideEndPicker = () => {
        this.setState({
            isVisible2: false,
        })
    }

    render() {
        LayoutAnimation.easeInEaseOut();
        return(

            <SafeAreaView style={styles.container}>
                {this.state.loading == false ? (
                    <ScrollView>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="md-arrow-back" size={24} color="#000000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.handleMarkerPost}>
                                <Text style={{ fontWeight: "500" }}>Post</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            <View style={{ marginTop: '5%' }}>
                                <Text>
                                    <Text style={styles.inputTitle}>Title</Text>
                                    <Text style={styles.red_highlight}>*</Text>
                                </Text>
                                <TextInput 
                                    style={styles.input} 
                                    autoCapitalize="none"
                                    onChangeText={title => this.setState({title})}
                                    value={this.state.title}
                                ></TextInput>
                            </View>

                            <View style={{marginTop:'5%'}}>
                                <Text style={styles.inputTitle}>Description</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        autoFocus={false}
                                        multiline={true}
                                        numberOfLines={4}
                                        style={{ flex: 1 }}
                                        placeholder="Want to share something?"
                                        onChangeText={description => this.setState({ description })}
                                        value={this.state.description}
                                    ></TextInput>
                                </View>
                            </View>

                            
                            <View style={{ marginTop: '5%' }}>
                                <Text>
                                    <Text style={styles.inputTitle}>Category</Text>
                                    <Text style={styles.red_highlight}>*</Text>
                                </Text>
                                <Picker 
                                    selectedValue={this.state.PickerSelectCategory} 
                                    onValueChange={(itemValue, itemIndex) => this.setState({PickerSelectCategory: itemValue, category: itemValue})} >
                                    
                                    <Picker.Item label="Music" value="music"></Picker.Item>
                                    <Picker.Item label="Sports/Fitness" value="sports"></Picker.Item>
                                    <Picker.Item label="Community" value="community"></Picker.Item>
                                    <Picker.Item label="Religious/Spiritual" value="religious"></Picker.Item>
                                    <Picker.Item label="Emergency" value="emergency"></Picker.Item>
                                    <Picker.Item label="Health Care" value="healthcare"></Picker.Item>
                                    <Picker.Item label="News" value="news"></Picker.Item>
                                    <Picker.Item label="Others" value="others"></Picker.Item>
                                </Picker>
                            </View>   



                            <View style={{ marginTop: '5%' }}>
                                <Text style={styles.inputTitle}>Select Dates:</Text>
                                <TouchableOpacity style={styles.date_picker_button_start} onPress={this.showStartPicker}>
                                        {/* <Text style={styles.date_picker_text}>Starts *  {this.state.startDate}</Text> */}
                                        <Text>
                                            <Text style={styles.date_picker_text}>Starts</Text>
                                            <Text style={styles.red_highlight}>*</Text>
                                            <Text style={styles.date_picker_text}> {this.state.startDate}</Text>
                                        </Text>
                                        <DateTimePicker
                                            isVisible={this.state.isVisible1}
                                            onConfirm={this.handleStartPicker}
                                            onCancel={this.hideStartPicker}
                                            mode={'datetime'}
                                            // datePickerModeAndroid={'spinner'}
                                            is24Hour={false}
                                        />
                                </TouchableOpacity>


                                <TouchableOpacity style={styles.date_picker_button_end} onPress={this.showEndPicker}>
                                    {/* <Text style={styles.date_picker_text}>Ends *  {this.state.endDate}</Text> */}

                                    <Text>
                                        <Text style={styles.date_picker_text}>Ends</Text>
                                        <Text style={styles.red_highlight}>*</Text>
                                        <Text style={styles.date_picker_text}> {this.state.endDate}</Text>
                                    </Text>
                                    <DateTimePicker
                                        isVisible={this.state.isVisible2}
                                        onConfirm={this.handleEndPicker}
                                        onCancel={this.hideEndPicker}
                                        mode={'datetime'}
                                        // datePickerModeAndroid={'spinner'}
                                        is24Hour={false}
                                    />

                                </TouchableOpacity>
                            </View>




                            <View style={{ marginTop: '5%' }}>
                                <Text style={styles.inputTitle}>Website Link</Text>
                                <TextInput 
                                    style={styles.input} 
                                    autoCapitalize="none"
                                    onChangeText={website_link => this.setState({website_link})}
                                    value={this.state.website_link}
                                ></TextInput>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: '5%'}}>
                                <View style={{justifyContent: 'center' }}>
                                    <Text style={styles.inputTitle}>LATITUDE* : {this.state.latitude} &#176;N</Text>
                                    <Text style={styles.inputTitle}>LONGITUDE* : {this.state.longitude} &#176;E</Text>
                                </View>
                            </View>
                            
                            
                            <TouchableOpacity 
                                style={styles.chooseLocation} 
                                onPress={() => this.props.navigation.navigate('PlacePicker',{onGoback : this.refresh})}
                            > 
                                <Icon 
                                name="ios-map" 
                                size={30} 
                                style={{color: 'black'}} 
                                />
                                <Text style={styles.chooseLocationText}>SELECT VIA MAP</Text>
                            </TouchableOpacity>              

                        </View>

                        <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                            <Icon name="md-camera" size={32} color="#000000" />
                        </TouchableOpacity>

                        <View style={{ margin: '10%'}}>
                            <ScaledImage
                                ref={child => this._image = child} 
                                uri={ this.state.image } 
                                width={SCREEN_WIDTH*0.8} 
                            />    
                        </View>

                    </ScrollView>
                ):(
                    <View style={styles.containerActInd}>
                         <Text>POSTING...</Text>
                        <ActivityIndicator size="large"  color="#2761BEFF"></ActivityIndicator>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    // container:{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // }

    container: {
        flex: 1,
        backgroundColor: '#afeeee'
        // alignItems: "center",
        // justifyContent: "center"
    },
    containerActInd:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#6495ed",
        backgroundColor: 'white'
    },
    inputContainer: {
        margin: '0%',
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth,

    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
    },
    photo: {
        alignItems: "center",
        marginHorizontal: 32,
        
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#000000",
        fontSize: 10,
        textTransform: "uppercase",
        
    },
    input: {
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height:40,
        fontSize: 15,
        color: "#161F3D",
    },
    chooseLocation: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf:'center',
        marginTop: '3%',
        backgroundColor: '#0894fd',
        paddingHorizontal: '3%',
        borderRadius: 30
    },
    chooseLocationText: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '1%',
        marginLeft: '1%',
        color: 'black',
    },
    circular_button_style: {
        color: "#0894fd",
        shadowColor: "#0000ff",
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        shadowOpacity: 0.3
    },
    date_picker_button_start: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '80%',
        height: 45,
        borderRadius: 0,
        // backgroundColor: '#00ff7f',
        justifyContent: 'space-between',
    },
    date_picker_button_end: {
        borderBottomWidth: StyleSheet.hairlineWidth,

        width: '80%',
        height: 45,
        borderRadius: 0,
        // backgroundColor: '#ffd700',
        // backgroundColor: '#00ff7f',
        justifyContent: 'space-between',
    },    
    date_picker_text: {
        fontSize: 10,
        color: 'black',
        textAlign: 'right',
    },
    red_highlight:{
        color: '#ff4500'
    }
});