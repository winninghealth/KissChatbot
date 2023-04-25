import React, { Component } from 'react';
import {
 AppRegistry,
 StyleSheet,
 Alert,
 View,
 Text,
} from 'react-native';
 
class Main extends Component {
   render() {
     return (
       <View style={styles.flex}>
         <Text style={styles.back_text} onPress={this.showAlert.bind(this)}>
          弹出
         </Text>
       </View>
     );
   }
 
   showAlert() {
     Alert.alert('标题内容','正文内容');
   }
 }
 
 const styles = StyleSheet.create({
  flex:{
     flex:1
  },
  back_text:{
    width: 80,
    backgroundColor: 'gray',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 20
  }
 });
 
 AppRegistry.registerComponent('HelloWorld', () => Main);