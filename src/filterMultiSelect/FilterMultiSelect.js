import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, Button } from 'react-native';



export default class FilterMultiSelect extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    return (  
      <ScrollView 
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContentContainer}
      >
        <Text style={{marginBottom: '2%'}}>Hello!</Text>
        <Text style={{marginBottom: '2%'}}>Hello!</Text>
        <Text style={{marginBottom: '2%'}}>Hello!</Text>

        <Text style={{marginBottom: '2%'}}>Hello!</Text>

        <Button title="Hide modal" onPress={this.props.toggleModalProp()} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  filterContainer: {
    flex:1, 
    alignSelf:'stretch', 
    marginLeft: '0%', 
    marginRight: '0%'
  },
  filterContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: '10%',
    paddingBottom: '10%'
  }
});