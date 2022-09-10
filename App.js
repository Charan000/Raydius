// import GoogleMap from './src/ggMap/googleMap'
// import * as firebase from 'firebase'

import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, YellowBox} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer,createNavigator, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import LoadingScreen from './Screens/LoadingScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';

import HomeScreen from './Screens/HomeScreen';
import MessageScreen from './Screens/MessageScreen';
import PostScreen from './Screens/PostScreen';
import ListViewScreen from './Screens/ListViewScreen';
import ProfileScreen from './Screens/ProfileScreen';
import AddMarkerDataScreen from './Screens/AddMarkerDataScreen';
import PlacePickerScreen from './Screens/PlacePickerScreen';
import SavedPostsScreen from './Screens/SavedPostsScreen';
import OwnPostsScreen from './Screens/OwnPostsScreen';

YellowBox.ignoreWarnings([ 'Setting a timer' ]);

// Firestore addEventListener temporary fix
import {decode, encode} from 'base-64';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }
window.addEventListener = x => x;

const HomeScreenStack = createStackNavigator({
	HomePage: HomeScreen,
	AddMarkerData: AddMarkerDataScreen,  
	PlacePicker: PlacePickerScreen,
});

const ProfileScreenStack = createStackNavigator({
	ProfilePage: ProfileScreen,
	SavedPosts: SavedPostsScreen,  
	OwnPosts: OwnPostsScreen,
});

const AppContainer = createStackNavigator(
	{
		default: createBottomTabNavigator(
			{
				Home: {
					screen: HomeScreenStack,
					navigationOptions: {
						headerShown: false,
						tabBarIcon: ({ tintColor }) => <Icon name="ios-globe" size={24} color={tintColor}/>
					}
				},
				// Message: {
				// 	screen: MessageScreen,
				// 	navigationOptions: {
				// 		tabBarIcon: ({ tintColor }) => <Icon name="ios-chatboxes" size={24} color={tintColor}/>
				// 	}
				// },
				// Post: {
				// 	screen: PostScreen,
				// 	navigationOptions: {
				// 		tabBarIcon: ({ tintColor }) =>
				// 		<Icon 
				// 			name="ios-add-circle" 
				// 			size={48} 
				// 			color="#0894fd"
				// 			style={{
				// 			shadowColor: "#0894fd",
				// 			shadowOffset: {width: 0, height: 0},
				// 			shadowRadius: 10,
				// 			shadowOpacity: 0.3
				// 			}}  
				// 		/>
				// 	}
				// },
				ListView: {
				  screen: ListViewScreen,
				  navigationOptions: {
					tabBarIcon: ({ tintColor }) => <Icon name="ios-list" size={24} color={tintColor}/>
				  }
				},
				Profile: {
					screen: ProfileScreenStack,
					navigationOptions: {
						headerShown: false,
						tabBarIcon: ({ tintColor }) => <Icon name="ios-person" size={24} color={tintColor}/>
					}
				}
			},
			{
				defaultNavigationOptions: {
					tabBarOnPress: ({navigation, defaultHandler}) => {
						defaultHandler()
					}
				},
				tabBarOptions: {
				  activeTintColor: "#0894fd",
				  inactiveTintColor: "#B8BBC4",
				  showLabel: false
				}
			}
		)
	},
	{
		mode: "modal",
		headerMode: "none"
	}
)

const AuthStack = createStackNavigator({
  Login: LoginScreen,  
  Register: RegisterScreen
});



export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
	  Auth: AuthStack,
    },
    {
      initialRouteName: "Loading"
    }
  )
);



