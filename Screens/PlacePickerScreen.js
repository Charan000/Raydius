import React, { Component, PureComponent } from 'react';
import {View, StyleSheet, Dimensions, Image, Button, Text, SafeAreaView} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';
const {width, height} = Dimensions.get('window');
import marker from '../assets/picklocmarker.png'

const latDelta = 0.025;
const longDelta = 0.025;



export default class PlacePicker extends Component {

    static navigationOptions = {
        headerShown: false
    };

    constructor() {
        super();
        this.state = {
            region: {
              latitude: 0,
              longitude: 0,
              latitudeDelta: latDelta,
              longitudeDelta: longDelta,
            }
          };
        this.getLocationPermission();
    }

    onRegionChange = region => {
        this.setState({
          region
        })
    }

    getLocationPermission = async () => {
        if(Platform.OS === 'ios') {
          // alert("Hi this is ios platform"); //working
        } else {
          //alert("Hi this is android platform");
          const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }
    };

    goToCurrentLocation() {
        Geolocation.getCurrentPosition(
          position => {
              var lat = parseFloat(position.coords.latitude);
              var long = parseFloat(position.coords.longitude);
  
              var currentRegion = {
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: latDelta,
                  longitudeDelta: longDelta,
              };
              this.map.animateToRegion(currentRegion, 500);
          },
          error => {
              alert(JSON.stringify(error));
              console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 20000},
        );
    }
      
    async componentDidMount() {
        Geolocation.getCurrentPosition(
            position => {
                var lat = parseFloat(position.coords.latitude);
                var long = parseFloat(position.coords.longitude);

                var initialRegion = {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: latDelta,
                    longitudeDelta: longDelta,
                };
                this.setState({
                    region: initialRegion,
                });
            },
            error => {
                alert(JSON.stringify(error));
                console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 20000},
        );
    }

    updatedataInPrevScreen = () => {
        this.props.navigation.state.params.onGoback(this.state.region.latitude, this.state.region.longitude);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.map}>
                
                <MapView
                    ref={map => this.map = map}
                    style={styles.map}
                    region={this.state.region} 
                    showsUserLocation={true} 
                    showsPointsOfInterest={false}
                    showsMyLocationButton={false} 
                    cacheEnabled={false}
                    showsBuildings={false}
                    onRegionChangeComplete={this.onRegionChange}
                />

                <View style={styles.markerFixed}>
                    <Image style={styles.marker} source={marker} />
                </View>
                
                <SafeAreaView style={styles.footer}>
                    {/* <Text style={styles.region}>{JSON.stringify(this.state.region, null, 2)}</Text> */}
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.chooseLocationText}>LATITUDE : {this.state.region.latitude}</Text>
                        <Text style={styles.chooseLocationText}>LONGITUDE : {this.state.region.longitude}</Text>
                        <Button
                            style= {{borderRadius: 30}}
                            onPress={this.updatedataInPrevScreen}
                            title="Select Location"
                            color="#0894fd"
                        />
                    </View>
                </SafeAreaView>

                {/* Current Loc Button */}
                <SafeAreaView style={styles.locate_button_position} > 
                    <Icon 
                        name="md-locate" 
                        size={30} 
                        style={{color: '#DCDCDC'}}
                        onPress={()=>this.goToCurrentLocation()} 
                    />
                </SafeAreaView>
            
            </View>
      );
    }
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 48,
        width: 48
    },
    chooseLocationText: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '1%',
        marginLeft: '1%',
        color: "#FFF",
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: 0,
        position: 'absolute',
        width: '100%',
        paddingBottom: '15%' 
    },
    region: {
        color: '#fff',
        lineHeight: 20,
        margin: 20
    },
    locate_button_position: {
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        position: 'absolute',//use absolute position to show button on top of the map
        top: '5%', //for top align
        left: '85%',
        alignSelf: 'flex-end', //for align to right
        padding: 8,
        borderRadius: 10
    }
  });