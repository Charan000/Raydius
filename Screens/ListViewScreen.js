import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, YellowBox, ActivityIndicator, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import firebase from 'firebase';
import AutoHeightImage from 'react-native-auto-height-image';
import LogoMap from '../src/scaledImage/categoryLogoImage';
import Geolocation from 'react-native-geolocation-service';


import * as geolib from 'geolib';


YellowBox.ignoreWarnings([ 'Setting a timer' ]);

const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

export default class ListViewScreen extends React.Component {
    static navigationOptions = {
        headerShown: true,
        title: 'List View'
    };

    unsubscribe = null;

    constructor(props) {
        super(props);
        this.state = ({
            todoTasks: [],
            coordinates:{
                latitude:0,
                longitude:0
            },
            loading: false
        });
        this.ref = firebase.firestore().collection('raydius_firebase_markers');
        
    }

    async componentDidMount() {
        this.setState({
            loading:true
        });
        await this.getCurrentLocation();
        this.unsubscribe = this.ref.onSnapshot( (querySnapshot) => {
            const todos = [];
            querySnapshot.forEach((doc) => {
                todos.push(doc.data());
            });
            
            this.setState({
                //sorting the list to get nearest distance post
                todoTasks: todos                
            });
            this.setState({
                loading: false
            });
        });
    }  

    componentWillUnmount() {
        this.unsubscribe();
    }
    
    //function to get the users current locations
    getCurrentLocation() {
        return Geolocation.getCurrentPosition(
          position => {
              var lat = parseFloat(position.coords.latitude);
              var long = parseFloat(position.coords.longitude);
              var latlong = {
                latitude : lat,
                longitude : long
              };
              this.setState({
                  coordinates:latlong
              })
          },
          error => {
              alert(JSON.stringify(error));
              console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 20000},
        );
      }

    //function to get the distance between current location of user and the given post coordinate in 'kms'
    getDistanceinKm = (coordinates) => {
        var dist = geolib.getDistance(
            {latitude:this.state.coordinates.latitude,longitude:this.state.coordinates.longitude},
            {latitude:coordinates.latitude,longitude:coordinates.longitude})
        var ans = geolib.convertDistance(dist,'km').toFixed(1)
        // console.log(ans)
        return(ans)
    }

    goToMap = (coordinates) => {
        this.props.navigation.navigate("Home")
    }

    // getDimensions(uri) {
    //     return new Promise(resolve => {
    //         Image.getSize(uri, (width, height) => {
    //             var dimensions = {width, height};
    //             resolve(dimensions);
    //         });
    //     });
    // }
    
    // async updateImage(inputUri, category, desiredWidth) {
    //     var imgSource = null;
    //     var imgHeight = desiredWidth;
    //     var imgWidth = desiredWidth;

    //     if(inputUri === "no image") {
    //         imgSource = LogoMap.get(category);
    //         imgWidth = desiredWidth;
    //         imgHeight = desiredWidth;
    //     }
    //     else {
    //         imgSource = {uri: inputUri};
    //         const dimensions = await this.getDimensions(inputUri);
    //         imgWidth = desiredWidth;
    //         imgHeight = dimensions.height * (desiredWidth / dimensions.width);
    //     }

    //     var imgValues = {
    //         source : imgSource,
    //         width : imgWidth,
    //         height : imgHeight
    //     };        
    //     return imgValues;
    // }
    
    renderPost = post => {
        var imgSource = post.image_ref === "no image" ? LogoMap.get(post.category) : {uri : post.image_ref};
        return (
            <View style={styles.feedItem}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: '2%' }}>
                    <Text style={styles.timestamp}>Posted {moment(post.timestamp).fromNow()}</Text>
                    <Icon name="ios-more" size={24} color="#73788B" />
                </View>

                <View style={{marginVertical: '3%', marginHorizontal: '2%'}}>
                    <Text style={styles.post_title}>{post.title}</Text>
                    {/* For displaying the distance of the post from users current location */}
                    <Text style={styles.post_extras}>
                        <Text>
                            {'Within '}
                        </Text>
                        <Text style={styles.post_extras_values}>
                            {this.getDistanceinKm(post.coordinates)}
                        </Text>
                        <Text>
                            {' km radius'}
                        </Text>
                    </Text>
                    <Text style={styles.post_extras}>{'Category: '+post.category}</Text>
                </View>

                
                <View style={{marginHorizontal: '2%', marginBottom: '4%'}}>
                    <Text style={styles.post_description}>{post.description}</Text>
                    <Text style={styles.post_extras}>From {post.start_date}</Text>
                    <Text style={styles.post_extras}>To {post.end_date}</Text>
                </View>

                {/* <TouchableOpacity style={styles.plain_button} onPress={() => this.goToMap(post.coordinates)}>
                    <Text style={{fontSize: 20,color: 'white'}}>Go To Map</Text>
                </TouchableOpacity> */}

                {/* <Image source={imgSource} style={styles.postImage} resizeMode="cover" /> */}
                
                <AutoHeightImage
                    width={SCREEN_WIDTH}
                    source={imgSource}
                />

                <View style={{ flexDirection: "row", margin: '3%' }}>
                    <Icon name="ios-heart-empty" size={24} color="#73788B" style={{ marginRight: 16 }} />
                    <Icon name="ios-chatboxes" size={24} color="#73788B" />
                </View>
            </View>
        );
    };
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.feed_header}>
                    <TouchableOpacity>
                        {/* <Text style={{ fontWeight: "500", marginLeft: 100, marginTop:3 }}>Nearby Feeds</Text> */}
                        <Text style={{ alignSelf:'center' }}>Nearby Feeds</Text>
                    </TouchableOpacity>
                </View>


                {this.state.loading == false ? (
                    <FlatList 
                        style={styles.feed} 
                        // data={posts} 
                        data={this.state.todoTasks.filter(doc => {
                                if(doc===null) {
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            }
                        ).sort((a,b)=>{
                                //geolib.getDistance gives the distance between the given geopoint ({lat,long},{lat,long})
                                var dist1 = geolib.getDistance(
                                    {latitude:this.state.coordinates.latitude,longitude:this.state.coordinates.longitude},
                                    {latitude:a.coordinates.latitude,longitude:a.coordinates.longitude})
            
                                var dist2 = geolib.getDistance(
                                    {latitude:this.state.coordinates.latitude,longitude:this.state.coordinates.longitude},
                                    {latitude:b.coordinates.latitude,longitude:b.coordinates.longitude})   
            
                                return (dist1>dist2)
                            }
                        )}
                        keyExtractor={(item,index) => index.toString()}
                        renderItem={({item}) => this.renderPost(item)} 
                        showsVerticalScrollIndicator = {false}
                    />
                ):(
                    <View style={styles.containerActInd}>
                        <Text>LOADING...</Text>
                        <ActivityIndicator size="large"  color="#2761BEFF"></ActivityIndicator>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFECF4"
    },
    containerActInd:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    feed_header: {
        flex:1,
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 22,
        borderBottomWidth: 1,
        borderBottomColor: "#6495ed",
        backgroundColor: 'white',
        alignItems: "center",
        textAlign: "center"
    },
    header: {
        paddingTop: 34,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
    feed: {
        marginHorizontal: 0
    },
    feedItem: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 0,
        // flexDirection: "row",
        marginVertical: '2%'
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name:{
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp:{
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post_title: {
        fontSize: 24,
        color: "#708090",
        fontWeight: "bold"
    },
    post_extras: {
        fontSize: 12,
        color: "#C0C0C0"
    },
    post_extras_values: {
        fontSize: 14,
        color: "#C0C0C0"
    },
    post_description: {
        fontSize: 18,
        color: "#708090"
    },
    postImage: {
        width: undefined,
        height: 300,
        marginVertical: 16
    },
    plain_button: {
        alignSelf: 'center',
        backgroundColor: "#0894fd",
        borderRadius: 40,
        elevation: 5,
        paddingTop: '1%',
        paddingBottom: '1%',
        paddingLeft: '6%',
        paddingRight: '6%',
        marginTop: '3%',
        marginBottom: '2%'
    }
});