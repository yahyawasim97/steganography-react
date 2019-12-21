import React,{useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  Alert
} from 'react-native';
import {Input, Textarea,Item,Label, Button,Icon, Spinner} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
const Encrypt: () => React$Node = () => {
    const [visible,setVisible] = useState(false);
    const [message,setMessage] = useState('');
    const [password,setPassword] = useState('');
    const [image,setImage] = useState(null);
    const [loading,setLoading] = useState(false);
    function handleImagePicker(){
        ImagePicker.openPicker({
            mediaType: 'any',
            includeBase64:true,
            compressImageMaxWidth:500,
            compressImageQuality:0.1
          }).then(image => {
            setVisible(false);
            console.log(image)
            setImage({
                uri: image.path,
                type: image.mime,
                name: image.filename
            });
        });
    }
    function handleCamera(){
        ImagePicker.openCamera({
            mediaType: 'any'
          }).then(image => {
            console.log(image);
        });
    }

    function sendRequest(){
        setLoading(true);
        var data = new FormData();
        data.append('password',password);
        data.append('msg',message);
        data.append('encImage',image);
        axios.post('http://192.168.100.36:8000/api/imgEncrypt',data).then(response =>{
            download(response.data.encImage)
            setLoading(false);
        })
        .catch(error =>  {console.log(error)});
    }
    function download(url){
        var date      = new Date();
        var ext       = extention(url);
        ext = "."+ext[0];
        const { config, fs } = RNFetchBlob
        let PictureDir = fs.dirs.PictureDir
        let options = {
          fileCache: true,
          addAndroidDownloads : {
            useDownloadManager : true,
            notification : true,
            path:  PictureDir + "/image_"+Math.floor(date.getTime() + date.getSeconds() / 2)+ext,
            description : 'Image'
          }
        }
        config(options).fetch('GET', url).then((res) => {
          Alert.alert("Success Downloaded");
        });
      }
    function extention(filename){
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    return (

    <View style={styles.body}>
        <View style={{flex:3,justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>setVisible(true)}> 
                {image?<Image source={{uri: 'data:image/jpeg;base64, '+image.data}} style={{width:300,height:300}} />:<Image source={require('../assets/img/Image.jpg')} style={{width:'100%',height:'80%'}} resizeMode="contain"/>}
            </TouchableOpacity>
        </View>
        <View style={{flex:2}}>
            <Textarea rowSpan={5} bordered placeholder="Add Text here..." value={message} onChangeText={(value)=>setMessage(value)} />
            <Item floatingLabel style={{marginVertical:10}}>
              <Label>Password</Label>
              <Input value={password} onChangeText={(value)=> setPassword(value)} />
            </Item>
        </View>
        <View style={{flex:1,justifyContent:'center'}}>
        <Button onPress={()=>sendRequest()} style={styles.buttonStyle} block>{loading?<Spinner color={"white"}/>:<Text style={styles.textStyle}>Submit</Text>}</Button>
        </View>
        <Modal 
            transparent={true}
            animationType={"fade"}
            visible={visible}
            onRequestClose={() => { setVisible(false)}} >
            <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <View style={{width: 200,height: 200,backgroundColor:'white',borderColor:'grey',borderWidth:2,borderRadius:10}}>
                    <Icon type="Entypo" onPress={()=>setVisible(false)} name="cross" style={{position:'absolute',right:0,top:0,zIndex:9999}} />
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',borderBottomWidth:2}}><Text style={{fontWeight:'bold'}}>Select a Photo</Text></View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><TouchableOpacity onPress={()=>handleCamera()}><Text>Open Camera</Text></TouchableOpacity></View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><TouchableOpacity onPress={()=>handleImagePicker()}><Text>Open Gallery</Text></TouchableOpacity></View>
                </View>
            </View>
        </Modal>
        
    </View>
  );
};

const styles = StyleSheet.create({
  body:{
    flex:1,
    padding:20,
  },
  buttonStyle:{
    marginVertical:5,
    padding:10
  },
  textStyle:{
    color:'white',
    fontWeight:'bold',
    fontSize:15,
    textAlign:'center'
  }
});

export default Encrypt;
