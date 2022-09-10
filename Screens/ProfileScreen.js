import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView, Image } from 'react-native';
import * as firebase from 'firebase';

export default class ProfileScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        // own_posts_number: 0,
        // saved_posts_number: 0,
        email: "",
        displayName: "" 
    }

    constructor() {
        super();
        this.profileRef = firebase.firestore().collection('raydius_firebase_profiles');
        this.userId = firebase.auth().currentUser.uid;
    }

    componentDidMount() {
        
        const {email, displayName} = firebase.auth().currentUser;
        this.setState({email,displayName});
    }

    handleSignOutAlert = () => {
        Alert.alert(
            "Attention!",
            "Are you sure that you want to log out?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.signOutUser() }
            ],
            { cancelable: false }
        );
    }

    signOutUser = () => {
        firebase.auth().signOut();
    };

    savedPosts() {
        this.props.navigation.navigate("SavedPosts");
    }

    ownPosts() {
        this.props.navigation.navigate("OwnPosts");
    }

    render() {
        LayoutAnimation.easeInEaseOut();
        return(
            <ScrollView style={styles.container}>
                <View style={styles.header}></View>
                <Image 
                    style={styles.avatar} 
                    source={
                        require("../assets/blankprofilepic.png")
                    }    
                />

                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{this.state.displayName}</Text>

                        <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.ownPosts()}>
                            <Text style={{color: 'black'}}>Your Posts</Text>  
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.savedPosts()}>
                            <Text>Saved Posts</Text> 
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.plain_button} onPress={this.handleSignOutAlert}>
                    <Text style={{color: 'black'}}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        backgroundColor: "#2761BEFF",
        height:200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:130
    },
    body: {
        marginTop : 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
    },
    name: {
        fontSize:22,
        color:"#000000",
        // fontWeight:'600',
  },
    statsContainer: {
        flexDirection: "row",
        alignSelf: 'stretch',
        justifyContent: "space-evenly",
        margin: 32
    },
    stats: {
        alignItems: "center",
        justifyContent: 'space-evenly',
        flex: 1
    },
    statAmount: {
        color: "#4F566D",
        fontSize: 18,
        fontWeight: "100"
    },
    statTitle:{
        color:"#C3C5CD",
        fontSize: 12,
        // fontWeight: "500",
        marginTop:4
    },
    plain_button: {
        alignSelf: 'center',
        backgroundColor: "#afeeee",
        borderRadius: 40,
        elevation: 5,
        paddingTop: '1%',
        paddingBottom: '1%',
        paddingLeft: '6%',
        paddingRight: '6%',
        marginTop: '20%',
        marginBottom: '4%'
    },
    buttonContainer: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#afeeee",
    },
});