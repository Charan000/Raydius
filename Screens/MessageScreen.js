import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, YellowBox} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import moment from 'moment';
import firebase from 'firebase'

YellowBox.ignoreWarnings([ 'Setting a timer' ]);




export default class MessageScreen extends React.Component {


    constructor(props) {
        super(props);
        this.state = ({
            todoTasks: []
        });
        this.ref = firebase.firestore().collection('posts');
    }
    
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot((querySnapshot) => {
            const todos = [];
            querySnapshot.forEach((doc) => {
                todos.push({
                    text: doc.data().text,
                    uid: doc.data().uid,
                    image: doc.data().image
                });
            });
            this.setState({
                todoTasks: todos
            });
        });
    }

    renderPost = post => {
        return (

            // <View>
            //      <Text>I'm a post</Text>
            // </View>

            // <FlatList
            //     data={this.state.todoTasks}
            //     renderItem={({item,index}) => {
            //         return (
            //             <View>
            //                 <Text>{item.text}</Text>
            //                 <Text>{item.uid}</Text>
            //                 <Text>{item.image}</Text>

            //                 <Image source={{uri: item.image}} style={{height:200}}/>
            //             </View>

            //         );
            //     }}
            //     keyExtractor = {(item,index) => item.text}
            // >

            // </FlatList>
            



            <View style={styles.feedItem}>
                <Image source={post.avatar} style={styles.avatar} />
                <View style={{flex: 1}}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={styles.name}>{post.name}</Text>
                            {/* <Text style={styles.timestamp}>{post.timestamp}</Text> */}
                            <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                        </View>


                        <Icon name="ios-more" size={24} color="#73788B" />

                    </View>

                    <Text style={styles.post}>{post.text}</Text>

                    {/* <Image source={post.image} style={styles.postImage} resizeMode="cover" /> */}
                    <Image source={{uri:post.image}} style={styles.postImage} resizeMode="cover" />

                    <View style={{ flexDirection: "row" }}>
                        <Icon name="ios-heart-empty" size={24} color="#73788B" style={{ marginRight: 16 }} />
                        <Icon name="ios-chatboxes" size={24} color="#73788B" />
                    </View>

                </View>
            </View>



        );
    };
    
    
    
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Feed</Text>
                </View>

                <FlatList 
                    style={styles.feed} 
                    // data={posts} 
                    data={this.state.todoTasks}
                    keyExtractor={(item,index) => index.toString()}
                    renderItem={({item}) => this.renderPost(item)} 
                    showsVerticalScrollIndicator = {false}
                />
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFECF4"
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
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
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
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    }
});



// actual message screen code --> 07/04/20
// import React, { Component } from 'react';

// import { View, Text, StyleSheet } from 'react-native';


// export default class MessageScreen extends Component {
//     render() {
//         return (
//             <View style={styles.container}>
//                 <Text>Message Screen</Text>
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center"
//     }
// });