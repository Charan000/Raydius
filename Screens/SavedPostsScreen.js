import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, FlatList, Dimensions, Image, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import firebase from 'firebase';
import AutoHeightImage from 'react-native-auto-height-image';
import LogoMap from '../src/scaledImage/categoryLogoImage';
import Geolocation from 'react-native-geolocation-service';
import * as geolib from 'geolib';
import Fire from '../Fire';

const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

export default class SavedPostsScreen extends Component {
    static navigationOptions = {
        title: 'Saved Posts'
    };

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
        this.profileRef = firebase.firestore().collection('raydius_firebase_profiles');
        this.markerRef = firebase.firestore().collection('raydius_firebase_markers');
        this.userId = firebase.auth().currentUser.uid;
        this.getCurrentLocation();
    }

    //function to get the users current locations
    getCurrentLocation() {
        Geolocation.getCurrentPosition(
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
        console.log(ans)
        return(ans)
    }

    printArray() {
        console.log(this.state.todoTasks.length);
        console.log(this.state.todoTasks);
    }

    getItems = (item_ids, callback) => {
        let itemRefs = item_ids.map(id => {
          return this.markerRef.doc(id).get();
        });
        Promise.all(itemRefs)
        .then(docs => {
            // let items = docs.map(doc => doc.data());
            let items = docs.map(function(doc, index){
                // console.log(doc.id);
                if(doc.exists) {
                    let jsonObject = doc.data();
                    jsonObject['id'] = doc.id;
                    return jsonObject;
                }
                else {
                    Fire.shared.deleteSavedPostFromMap(doc.id);
                    return null;
                }
            });
            callback(items);
        }).catch(error => console.log(error))
    }

    updateContent() {
        this.profileRef.doc(this.userId).get().then(doc => {
            if (doc.exists) {
                let itemsToGet = Object.keys(doc.data().saved_posts);
                this.getItems(itemsToGet, items => this.setState({todoTasks: items.filter(doc => {
                            if(doc===null) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                    )
                }));
                this.setState({
                    loading:false
                });
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    handleDeletePostAlert = post => {
        var post_id = post.id;
        console.log(post_id);
        // Fire.shared.deleteSavedPostFromMap(post_id);
        // this.removeFromArray(post_id);
        Alert.alert(
            "Attention!",
            "Are you sure that you want to remove this post from saved posts?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.deleteSavedPost(post) }
            ],
            { cancelable: false }
        );
    }

    deleteSavedPost = post => {
        var post_id = post.id;
        Fire.shared.deleteSavedPostFromMap(post_id);
        this.removeFromArray(post_id);
    }

    removeFromArray(post_id){
        this.setState({todoTasks: this.state.todoTasks.filter(function(post) { 
            return post.id !== post_id
        })});
    }

    componentDidMount() {
        this.setState({
            loading:true
        });
        this.updateContent();
    }

    renderPost = post => {
        var imgSource = post.image_ref === "no image" ? LogoMap.get(post.category) : {uri : post.image_ref};
        return (
            <View style={styles.feedItem}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: '2%' }}>
                    <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                    <Icon name="ios-more" size={24} color="#73788B" />
                </View>

                <View style={{marginVertical: '4%', marginHorizontal: '2%'}}>
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

                {/* <TouchableOpacity style={styles.plain_button} >
                    <Text style={{fontSize: 20,color: 'white'}}>Unsave</Text>
                </TouchableOpacity> */}

                {/* <Image source={imgSource} style={styles.postImage} resizeMode="cover" /> */}
                
                <AutoHeightImage
                    width={SCREEN_WIDTH}
                    source={imgSource}
                />

                <View style={{ flexDirection: "row",  margin: '3%' }}>
                    <Icon name="ios-heart-empty" size={24} color="#73788B" style={{ marginRight: 16 }} />
                    <Icon name="ios-chatboxes" size={24} color="#73788B" />
                    <Icon name="ios-trash" 
                        size={24}  
                        color="#73788B"  
                        style={{ marginLeft: '79%' }} 
                        onPress={() => this.handleDeletePostAlert(post)}
                    />
                </View>
            </View>
        );
    };
    

    render() {
        return (
            <View style={styles.container}>
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