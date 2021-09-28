import * as React from 'react';
import { Text, View, StyleSheet, Button, Image, Platform, Alert} from 'react-native';
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
  state = {image:null}
  render(){
    let {image} = this.state
    return(
      <View style = {{flex:1,alignItems:"center",justifyContent:"center"}}>
      <Button title="Pick an image" onPress={this.pickImage}/>
      </View>
    )
  }

componentDidMount(){
  this.getPermissionasync()
}
getPermissionasync = async()=>{
  if(Platform.OS!=="web"){
const{status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
if(status!=="granted"){
Alert.alert("We need camera roll permission")
}
  }
}

pickImage = async()=>{
  try{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,aspect:[4,3],quality:1
    })
if(!result.cancelled){
  this.setState({image:result.data})
  this.uploadImage(result.uri)
}
  }

catch(err){console.log(err)}
}

uploadImage = async(uri)=>{
  const data = new FormData()
  let filename = uri.split("/")[uri.split("/").length-1]
  let type = `image/${uri.split(".")[uri.split(".").length-1]}`
  const filetoupload = {
    uri:uri,name:filename,type:type
  }
  data.append("digit",filetoupload)
  fetch("https://d073-106-214-159-201.ngrok.io",{
    method:"POST", body:data, headers:{"content-type":"multipart/form-data",}
  })
  .then((response)=>{response.json()})
  .then((result)=>{console.log("success",result)})
  .cath((err)=>{console.log(err)})
}

}