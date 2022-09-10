import React, { Component, PureComponent } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Image, Button, Text, StatusBar, Alert, TouchableOpacity} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import MapView,{Callout,Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'firebase';
import {Mapstyle, Mapstylepokemon, Mapstylepokemondetailed} from './mapstyling';
import Markermap from './categoryMarkerImage';

const {width, height} = Dimensions.get('window');

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


export default class googleMap extends PureComponent {
    
    unsubscribe = null;

    constructor() {
      super();
      this.state = {
        region: {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        },
        markers: [
          
        ],
        currentCategory: "all"
      };
      this.ref = firebase.firestore().collection('raydius_firebase_markers');
      this.getLocationPermission();
    }

    updateMarkerList() {
      this.unsubscribe = this.ref.onSnapshot((querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
            todos.push({
                coordinate: 
                {
                  latitude: doc.data().coordinates.latitude,
                  longitude: doc.data().coordinates.longitude
                },
                title: doc.data().title,
                id: doc.id,
                category: doc.data().category
            });
        });
        this.setState({
            markers: todos
        });
      });
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
            var latlong = {
              latitude : lat,
              longitude : long
            };
            this.map.animateCamera({center: latlong, pitch: 60, zoom: 15}, 5000);
            // var currentRegion = {
            //     latitude: lat,
            //     longitude: long,
            //     latitudeDelta: LATITUDE_DELTA,
            //     longitudeDelta: LONGITUDE_DELTA,
            // };
            // this.map.animateToRegion(currentRegion, 500);
            // this.map.animateCamera({center: latlong, pitch: 2, heading: 20,altitude: 200, zoom: 5}, 500);
        },
        error => {
            alert(JSON.stringify(error));
            console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 20000},
      );
    }
      
    async componentDidMount() {
      this.updateMarkerList();
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    showMarkerContent(id) {
      this.props.displayMarkerProp(id);
    }


    filter(category) {
      this.setState({currentCategory : category});
      // alert(category);
    }

    render() {
      return (  
          <MapView 
            ref={map => this.map = map}  
            style={styles.map} 
            customMapStyle={Mapstylepokemondetailed}
            onMapReady={this.goToCurrentLocation()}
            // region={this.state.region} 
            showsUserLocation={true} 
            showsPointsOfInterest={false}
            showsMyLocationButton={false} 
            cacheEnabled={false}
            showsBuildings={false}
          >

              {this.state.markers
                .filter( (ele) => {
                  if(this.state.currentCategory === "all") {
                    return true;
                  }
                  else {
                    return ele.category === this.state.currentCategory;
                  }
                })
                .map(marker  => (  
                <Marker
                  key={marker.id}
                  coordinate={marker.coordinate}
                  title={marker.title}
                  description={marker.description}
                  // image={require('../../assets/bluemarkershadow.png')}
                >
                  <Image 
                    // source={require('../../assets/bluemarkershadow.png')}
                    source={Markermap.get(marker.category)} 
                    style={styles.img}>
                  </Image>
                  <Callout 
                    tooltip
                    onPress={()=>this.showMarkerContent(marker.id)}
                  >
                    <View style={styles.callout}>
                      <View style={styles.bubble}>
                        <Text style={styles.title}>{marker.title}</Text>
                        <Text style={styles.description}>Click for more</Text>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              ))}  
          </MapView>
      );
    }
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'absolute',
      height : SCREEN_HEIGHT,
      width : SCREEN_WIDTH,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dragHandler: {
      alignSelf: 'stretch',
      backgroundColor: 'rgba(52, 52, 52, 0.5)',
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      // height: 800
    },
    img: {
      height: 50, 
      width: 37 
    },
    button: {
      margin: 8
    },
    callout: {
      padding: 4
    },
    bubble: {
      backgroundColor: "#0894fd",
      padding: 10,
      borderRadius: 40,
      width: width * 0.5,
      elevation: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: "white",
      fontSize: 15,
      flex: 1,
      justifyContent: 'center',
      //width: width*0.4
    },
    description: {
      color: "#000000",
      fontSize: 12,
      flex: 1,
    }
  });