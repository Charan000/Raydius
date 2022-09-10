import React, { Component } from 'react';
import {View, Linking, ScrollView, StyleSheet, Dimensions, Alert, Text, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import ScaledImage from '../scaledImage/ScaledImage';
import moment from 'moment';
import AutoHeightImage from 'react-native-auto-height-image';
import LogoMap from '../scaledImage/categoryLogoImage';
import Fire from "../../Fire";

const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

export default class PanelContent extends Component {

    state = {
        markerId: "",
        title: "",
        description: "",
        category: "",
        publisher_uid: "",
        image_ref: "no image",
        website_link: "",
        imgSource: LogoMap.get("fallback"),
        timestamp: 0,
        start_date: "",
        end_date: ""
    };    

    constructor() {
        super();
        this.ref = firebase.firestore().collection('raydius_firebase_markers');
    }

    _goToURL = () => {
        Linking.canOpenURL(this.state.website_link).then(supported => {
            if (supported) {
                Linking.openURL(this.state.website_link);
            } else {
                console.log('Don\'t know how to open URI: ' + this.state.website_link);
            }
        });
    }

    setStateEmpty() {
        this.setState({
            markerId: "",
            title: "",
            description: "",
            category: "",
            publisher_uid: "",
            image_ref: "no image",
            website_link: "",
            imgSource: LogoMap.get("fallback"),
            timestamp: 0,
            start_date: "",
            end_date: ""
        });
    }

    printId(id) {
        console.log(id);
    }

    updateContent(id) {

        // To set panel content as empty
        this.setStateEmpty();
        // this._image.updateImage();
        // Fetch marker data once. 
        // Please not that if new fields are being fetched later, make changes accordingy in the 
        // class state variable and setEmptyState func.
        this.ref.doc(id).get().then(doc => {
            if (doc.exists) {
                this.setState({
                    markerId : id,
                    title : doc.data().title,
                    description : doc.data().description,
                    category : doc.data().category,
                    publisher_uid : doc.data().publisher_uid,
                    image_ref: doc.data().image_ref,
                    // website_link: "http://google.com",
                    website_link: doc.data().website_link,
                    timestamp: doc.data().timestamp,
                    start_date: doc.data().start_date,
                    end_date: doc.data().end_date,
                    imgSource: doc.data().image_ref === "no image" ? LogoMap.get(doc.data().category) : {uri : doc.data().image_ref}
                });
                // this._image.updateImage();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

    }

    savePost() {
        Fire.shared
            .saveMarkerPost(this.state.markerId)
            .then(ref => {
                alert("Post Saved!");
                this.setStateEmpty();
                // this.props.navigation.goBack();
            })
            .catch(error => {
                alert(error);
            });
    }

    handleSavePost() {
        Alert.alert(
            "Attention!",
            "Are you sure that you want to save this post?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.savePost() }
            ],
            { cancelable: false }
        );
    }

    render() {
        return (
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <Text style={styles.post_title}>{this.state.title}</Text>
                <Text style={styles.timestamp}>{moment(this.state.timestamp).fromNow()}</Text>
                {/* <ScaledImage
                    ref={child => this._image = child} 
                    uri={this.state.image_ref}
                    category={this.state.category}
                    width={SCREEN_WIDTH} 
                /> */}

                <AutoHeightImage
                    width={SCREEN_WIDTH}
                    source={this.state.imgSource}
                />
                
                <View style={{marginHorizontal: '2%'}}>
                    <Text style={styles.post_extras}>Category : {this.state.category}</Text>
                    
                    <Text style={styles.post_description}>{this.state.description}</Text>
                    <Text style={styles.post_extras}>From {this.state.start_date}</Text>
                    <Text style={styles.post_extras}>To {this.state.end_date}</Text>
                    
                    <View style={{ flexDirection: "row", marginTop: '4%', marginBottom: '4%' }}>
                        <Text style={{fontSize: 18}}>Website: </Text>
                        <Text style={{fontSize: 18, color: 'blue'}} onPress={this._goToURL}>{this.state.website_link}</Text>
                    </View>
                </View>

                {/* <Text style={styles.post}>publisher_uid : {this.state.publisher_uid}</Text> */}

                <TouchableOpacity style={styles.interest_button} onPress={() => this.handleSavePost()}>
                    <Text style={{fontSize: 20,color: 'white'}}>Save</Text>
                </TouchableOpacity>
                
                <Text 
                    style={{alignSelf: 'center', marginTop: '2%', fontSize: 18,color: "#0000FF"}}
                    onPress={() => this.props.panelCloseProp()}
                >
                    Close
                </Text>
            </ScrollView>   
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
        alignSelf:'stretch', 
        marginLeft: '0%', 
        marginRight: '0%'
    },
    contentContainer: {
        // alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        paddingTop: '10%',
        paddingBottom: '10%'
    },
    timestamp:{
        marginHorizontal: '2%',
        marginVertical: '2%',
        fontSize: 13,
        color: "#C4C6CE",
        marginTop: 4
    },
    post_title: {
        alignSelf: 'center',
        fontFamily: 'Cochin',
        fontSize: 25,
        color: "#000000",
    },
    post_extras: {
        fontSize: 14,
        color: "#838899"
    },
    post_description: {
        width: '80%',
        marginTop: '2%',
        marginBottom: '2%',
        fontSize: 18,
        color: "#000000"
    },
    interest_button: {
        alignSelf: 'center',
        backgroundColor: "#0894fd",
        borderRadius: 40,
        elevation: 5,
        paddingTop: '1%',
        paddingBottom: '1%',
        paddingLeft: '6%',
        paddingRight: '6%',
        marginBottom: '4%'
    },
});