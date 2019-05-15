import React, {Component} from 'react'
import {
Header,
Container,
} from 'semantic-ui-react'
import firebase from 'firebase/app'
import 'firebase/storage'
import 'react-day-picker/lib/style.css';
//Components
import ResponsiveContainer from '../../../Components/ResponsiveContainer'
import imageCompression from 'browser-image-compression';




export default class Create extends Component{
	state={
		imageSet:[]
	} 
	compress(link,data){
		imageCompression.loadImage(link).then(img=>{
			document.querySelector("#img").append(img);
			let canvas = imageCompression.drawImageInCanvas(img)
			let canvasElem = document.querySelector("canvas");
			let renderer = canvasElem.getContext("bitmaprenderer");
			canvasElem.width=canvas.width;
			canvasElem.height=canvas.height;
			renderer.transferFromImageBitmap(canvas.transferToImageBitmap())
			imageCompression.canvasToFile(canvasElem, "image/jepg", "image.jpeg", Date.now()).then(file=>{
				const options = { 
					maxSizeMB: 1,          // (default: Number.POSITIVE_INFINITY)
					maxWidthOrHeight: 800,   // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
				}
				imageCompression(file, options).then(compressedFile=>{
					console.log(compressedFile);
					this.upload(file,data);
				});
			})
		})
	}
	upload(file,data){
		let filename = data.id+'.'+data.type;
		let ref = firebase.storage().ref().child(`images/${filename}`);
		let task = ref.put(file);
		task.then(snapshot=>{
			//console.log(snapshot,image_id)
			snapshot.ref.getDownloadURL().then(url=>{
				
				firebase.firestore().collection('images').doc(data.id).set({
					url
				},{merge:true}).then(success=>{
					console.log("Success",data,success);
				});								
			})
			},fail=>console.log("FAIL",data,fail));
	}
	/*componentDidMount(props){
		console.log(imageCompression);
		let link = "https://firebasestorage.googleapis.com/v0/b/sac-sahodaya.appspot.com/o/images%2FTiD1fctRtrAVVC2UTyW3.jpeg?alt=media&token=eaf5adde-c431-40c9-874b-0e64b8d3d0b2";
		
		firebase.firestore().collection('images').onSnapshot(images=>{
		let storage = firebase.storage().ref();
			let count = 5;
			images.forEach(image=>{
				let data = image.data();
				data.id=image.id;
				if(data.height<1000 || data.width <1000)
					return;
				count--;
				if(count===0)
					return;
				storage.child(`images/${data.id}.${data.type}`).getDownloadURL().then(url=>{
					this.compress(url,data);
				})
			})
		});
	}*/
  render(){
	 
	return (
	  
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' }}>
        <Header as='h1'>Convert</Header>
			 {this.state.imageSet.length}
			 <div id="img"></div>
			 
			 <canvas id="canvas"></canvas>
      </Container>
    </ResponsiveContainer>
  )
}
}