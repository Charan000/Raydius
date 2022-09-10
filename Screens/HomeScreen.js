import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, Button } from 'react-native';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import SlidingUpPanel from 'rn-sliding-up-panel';
import GoogleMap from '../src/ggMap/googleMap';
import PanelContent from '../src/panel/panelContent';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-community/picker';


const {heigth, width} = Dimensions.get('window');
const SCREEN_HEIGHT = heigth;
const SCREEN_WIDTH = width;



export default class HomeScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        isFilterModalVisible: false,
        // isContentModalVisible: false,
        category: "all"
    }

    toggleFilterModal = () => {
        this.setState({isFilterModalVisible: !this.state.isFilterModalVisible});
    };

    // toggleContentModal = () => {
    //     this.setState({isContentModalVisible: !this.state.isContentModalVisible});
    // };

    updateCategoryInMap = () => {
        this.toggleFilterModal();
        this._map.filter(this.state.category);
    }

    addMarker() {
        this.props.navigation.navigate("AddMarkerData");
    }

    displayMarkerContent = (currentMarkerId) => {
        this._panelContent.updateContent(currentMarkerId);
        this._panel1.show();

        // this._panelContent.printId(currentMarkerId);
        // console.log(this._panelContent);
        // this.toggleContentModal();
    }

    render() {
        return (
            <View style={styles.container}>
                
                {/* Map Component */}
                <GoogleMap 
                    ref={child => this._map = child}
                    displayMarkerProp={this.displayMarkerContent}
                >
                </GoogleMap>
                
                
                {/* Filter Button */}
                <SafeAreaView 
                    style={styles.filter_button_position} 
                >   
                    <View style={styles.circular_bg}>
                        <Icon 
                            name="ios-funnel" 
                            size={30} 
                            style={{color: 'white'}}
                            // onPress={()=>this._map.filter('Filter title','Filter Description')}
                            onPress={this.toggleFilterModal}
                        />
                    </View>
                </SafeAreaView>

                {/* Add Button */}
                <SafeAreaView style={styles.add_button_position}> 
                    <Icon 
                        name="ios-add-circle" 
                        size={60} 
                        style={styles.circular_button_style}
                        onPress={()=>this.addMarker()} 
                    />
                </SafeAreaView>
                
                {/* Current Loc Button */}
                <SafeAreaView style={styles.locate_button_position} > 
                    <Icon 
                        name="md-locate" 
                        size={30} 
                        style={{color: '#FFFFFF'}}
                        onPress={()=>this._map.goToCurrentLocation()} 
                    />
                </SafeAreaView>

                {/* Sliding Panel for marker content */}
                <SlidingUpPanel 
                    ref={child => this._panel1 = child} 
                >
                    {dragHandler => (
                        <View style={styles.panelContainer}>
                            <View style={styles.dragHandler} {...dragHandler}>
                                <Icon 
                                    name="ios-arrow-down" 
                                    size={50} 
                                    style={styles.circular_button_style} 
                                />
                            </View>
                            <PanelContent
                                ref={child => this._panelContent = child} 
                                panelCloseProp={() => this._panel1.hide()}
                            >
                            </PanelContent>
                            
                            
                        </View>            
                        )}
                </SlidingUpPanel>

                {/* <Modal 
                    propagateSwipe 
                    isVisible={this.state.isContentModalVisible}
                    coverScreen={false}
                    onBackdropPress={this.toggleContentModal}
                    style={styles.filter_modal}
                >
                    <PanelContent
                        ref={child => this._panelContent = child} 
                        panelCloseProp={this.toggleContentModal}
                    >
                    </PanelContent>
                </Modal> */}
                        
                <Modal
                    propagateSwipe 
                    isVisible={this.state.isFilterModalVisible}
                    coverScreen={false}
                    onBackdropPress={this.updateCategoryInMap}
                    style={styles.filter_modal}
                >
                    <SafeAreaView 
                        style={styles.filterContainer}
                    >
                        <Picker
                            style={{alignSelf: 'stretch', margin: '2%'}} 
                            selectedValue={this.state.category} 
                            onValueChange = {(itemValue, itemIndex) => this.setState({category: itemValue})} 
                        >
                            <Picker.Item label="All" value="all"></Picker.Item>
                            <Picker.Item label="Music" value="music" ></Picker.Item>
                            <Picker.Item label="Sports/Fitness" value="sports"></Picker.Item>
                            <Picker.Item label="Community" value="community"></Picker.Item>
                            <Picker.Item label="Religious/Spiritual" value="religious"></Picker.Item>
                            <Picker.Item label="Emergency" value="emergency"></Picker.Item>
                            <Picker.Item label="Health Care" value="healthcare"></Picker.Item>
                            <Picker.Item label="News" value="news"></Picker.Item>
                            <Picker.Item label="Others" value="others"></Picker.Item>
                        </Picker>
                        <TouchableOpacity style={styles.plain_button} onPress={this.updateCategoryInMap}>
                            <Text style={{fontSize: 20,color: 'white'}}>Done</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Modal>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    dragHandler: {
        alignSelf: 'stretch',
        height: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        backgroundColor: 'white'
    },
    panelContainer: {
        flex: 1,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(52, 52, 52, 0.1)'
        backgroundColor: 'white',
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
    },
    locate_button_position: {
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        position: 'absolute',//use absolute position to show button on top of the map
        top: '6%', //for top align
        left: '85%',
        alignSelf: 'flex-end', //for align to right
        padding: 8,
        borderRadius: 10
    },
    add_button_position: {
        position: 'absolute',//use absolute position to show button on top of the map
        top: '87.7%', //for center align
        left: '85%',
        padding: 0
    },
    filter_button_position: {
        position: 'absolute',//use absolute position to show button on top of the map
        top: '88.5%', //for center align
        left: '4%',
        padding: 0
    },
    filter_modal: {
        flex: 1
    },
    filterContainer: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingTop: '10%',
        paddingBottom: '10%',
    },
    circular_button_style: {
        color: "#0894fd",
    },
    plain_button: {
        backgroundColor: "#0894fd",
        borderRadius: 40,
        elevation: 5,
        paddingTop: '1%',
        paddingBottom: '1%',
        paddingLeft: '6%',
        paddingRight: '6%',
        marginBottom: '4%'
    },
    circular_bg: {
        backgroundColor: "#0894fd",
        borderRadius: 40,
        paddingVertical: 10,
        paddingHorizontal: 13,
    }
});