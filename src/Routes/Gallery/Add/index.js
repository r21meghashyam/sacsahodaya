import React, {Component} from 'react'
import {
Header,
Container,
Form,
Button,
Image,
Card,
Icon,
Message,
Progress
} from 'semantic-ui-react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import  {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import firebase from 'firebase/app'
import 'firebase/storage'
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import {Link} from 'react-router-dom'
//Components
import ResponsiveContainer from '../../../Components/ResponsiveContainer'
import imageCompression from 'browser-image-compression';
import bindAll from 'react-autobind';

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class Create extends Component{ 
	state={
		images:[],
		oldImages:[],
		error:{}
	}
	constructor(props){
		super(props);
		bindAll(this);
	}
	componentWillMount(){
		this.loadData();
	}
	async loadData(){
		let album_id = this.props.match.params.album_id;
		let doc = await firebase.firestore().collection('albums').doc(album_id).get();
		let album = doc.data();
		console.log(album);
		let oldImages=[];
		if(album.imageIds)
		album.imageIds.forEach(image=>{
			firebase.firestore().collection('images').doc(image).onSnapshot(doc=>{
				let data = doc.data();
				oldImages.push({src:data.url,width:data.width,height:data.height,type:data.type,id:doc.id})
				this.setState({oldImages},()=>{
					console.log(oldImages)
				});
			})
		})
		this.setState(
			album
		)

	}
	close(){
		this.setState({modalOpen:false})
	  }
	  onChange(e){
		this.setState({[e.target.name]:e.target.value});
		
		}
		
	  onSubmit(e){
		e.preventDefault();
		let {name,date,images,error,description} = this.state;
		
		//VALIDATION
		error={};
		if(!name||name.trim()==="")
			error.album_name="Album name is empty";
		if(!description||description.trim()==="")
			error.description="Description is empty";
		if(!date||String(date).trim()==="")
			error.date="Date is empty";
		
		this.setState({error});
		if(Object.keys(error).length>0)
			return;

		
		let uploadBtn = document.querySelector('#uploadBtn');
		uploadBtn.disabled=true;
		uploadBtn.innerHTML="Modifying album..."
		
		
		let firestore = firebase.firestore(); 
		
		//Creating an album on firebase 
		firestore.collection("albums").doc(this.props.match.params.album_id).set({
			name,
			date,
			dateCreated: Date.now(),
			description,
		},{merge:true})
		
		.then(snapshot=>{
			let album_id = this.props.match.params.album_id;
			uploadBtn.innerHTML="Uploading images..."
			let count = images.length;
			let success=0;
			let imageIds=this.state.imageIds||[];
			


			//Create image id on firebase
			if(images.length===0){
				this.setState({completed:true,success:0,album_id})
			}
			else
			images.forEach((image,index)=>{
				let type = image.type.replace('image/','');
				firebase.firestore().collection('images').add({
					width:image.width,
					height:image.height,
					type,
					album:album_id
				})
				
				.then(doc=>{
					let image_id = doc.id;
					let filename = image_id+'.'+type
					imageIds.push(image_id)

					//upload image
					let ref = firebase.storage().ref().child(`images/${filename}`);
					let task = ref.put(image);

					task.on('state_changed', (snapshot)=>{
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
						images[index].progress=progress;
						images[index].state='uploading'
						this.setState({images})
					  }, (error)=> {
						// Handle unsuccessful uploads
						images[index].state='failed'
						this.setState({images})
						count--;
						if(count===0)
							this.setState({completed:true,success})
					  }, ()=> {
						images[index].state='success'
						this.setState({images})
						count--;
						success++;
						if(count===0){
							firestore.doc(`albums/${album_id}`).set({imageIds},{merge:true}).then(i=>{
								this.setState({completed:true,success,album_id})
							})
						}
							
					  });
					  task.then(snapshot=>{
						//console.log(snapshot,image_id)
						snapshot.ref.getDownloadURL().then(url=>{
							firebase.firestore().collection('images').doc(image_id).set({
								url
							},{merge:true});								
						})
					  })
				})
				
				
				

			})
		})
		
	  }
	  generateKey=(size=128)=>{
		let r=Math.random; 
		let string = "";
		while (string.length<size){
			let ch=(Math.floor(r()*100)%36).toString(36);
			let upper = Number(r().toString()[2])%2;
			if (upper>0)
				ch=ch.toUpperCase();
			string+=ch;
		}
		return string;
	};

	upload(e){
		const options = { 
			maxSizeMB: 1,          // (default: Number.POSITIVE_INFINITY)
			maxWidthOrHeight: 800,   // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
		}
		Array.from(e.target.files).forEach(file=>{
			
			imageCompression(file, options).then(image=>{
				let reader = new FileReader()
				reader.onload =  (data) => {
					image.data=data.target.result;
					let images = this.state.images;
					let img = new window.Image();
					img.onload=()=>{
						image.width=img.width;
						image.height=img.height;
						images.push(image);
						this.setState({images})
						//console.log(this);
					}
					img.src=data.target.result;
				}
				
				reader.readAsDataURL(image)
			})
			})
			
		e.target.value=""

	}
	remove(e){
		e.preventDefault();
		e.stopPropagation();
		let index = e.target.getAttribute('data-index');
		let {images} = this.state
		images.splice(index,1)
		this.setState({images})
	}
	async removeOld(e){
		e.preventDefault();
		let index = e.target.getAttribute('data-index');
		let album = this.props.match.params.album_id;
		let imageIds = this.state.imageIds;
		let oldImages = this.state.oldImages;
		console.log(index);
		let imageId = this.state.images[this.state.currentImage];
    let image = imageIds[index] +'.' + this.state.oldImages[index].type;
		imageIds.splice(index,1);
		oldImages.splice(index,1);
		
		firebase.firestore().collection("albums").doc(album).set({imageIds},{merge:true})
		await firebase.firestore().collection("images").doc(imageId).delete();
    firebase.storage().ref().child('images').child(image).delete();
		console.log(e,index);
		this.setState({imageIds,oldImages});
	}
	
	handleDayChange(e){
		this.setState({date:e.getTime()+(e.getTimezoneOffset()*60*1000)});
	}
	action(image,index){
		switch(image.state){
			case 'uploading': return(<Progress percent={image.progress} progress indicating />);
			case 'failed': return(<div style={{color:'#900'}}><Icon name="warning circle" color="red"/> Failed to upload</div>);
			case 'success': return(<div  style={{color:'#090'}}><Icon name="check circle" color="green"/> Success</div>);
			default: return(<Button  color="red" data-index={index} onClick={this.remove} icon><Icon name="trash"/>Remove</Button>)
		}
	}
  render(){
	  let {images,error,completed,success,album_id,oldImages} = this.state;
	return (
	  
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' }}>
        <Header as='h1'>Modify album</Header>
        <Form style={{padding:20}} onSubmit={this.onSubmit} error={Object.keys(error).length>0}>
          <Form.Field>
			<Form.Input fluid label='Album Name' placeholder='Album Name' error={Boolean(error.name)} name="name" onChange={this.onChange} value={this.state.name}/>
          </Form.Field>
		  <Form.Field>
			<Form.TextArea  label='Description' placeholder='Some Text Here...' error={Boolean(error.description)} name="description" onChange={this.onChange} value={this.state.description} />
          </Form.Field>
          <Form.Field>
            <label>Date</label>
            <DayPickerInput formatDate={formatDate} name="date" error={Boolean(error.date)}  onChange={this.onChange} parseDate={parseDate} value={`${moment(this.state.date).format('D/M/YYYY')}`} placeholder={`${formatDate(new Date())}`} onDayChange={this.handleDayChange}/>
          </Form.Field>
          <Form.Field>
          <Card.Group>
        	<label htmlFor="upload" style={{padding:20}}>
              <Card style={{background:Boolean(error.images)?'#912d2b':''}} >
                <Image src="/white-image.png"/>
            <Card.Content>
              <Card.Header><Icon name="upload" />Add Images</Card.Header>
              <input type="file" id="upload" accept="image/*" onChange={this.upload} hidden multiple/>
            </Card.Content>
          </Card>
          </label>
					{
			  oldImages.map((image,index)=>(
				<Card key={index}>
				
					<Image src={image.src}/>
				<Card.Content>
					<Button  color="red" data-index={index} onClick={(e)=>this.removeOld(e)} icon><Icon name="trash"/>Remove</Button>
				</Card.Content>
			</Card>
			  ))
		  }
		  {
			  images.map((image,index)=>(
				<Card key={index}>
				
					<Image src={image.data}/>
				<Card.Content>
					{this.action(image,index)}
				</Card.Content>
			</Card>
			  ))
		  }
          </Card.Group>
          </Form.Field>
		  <Message
			error
			header='Error'
			content={(<ul>
				{Object.keys(error).map((e,i)=><li key={i}>{error[e]}</li>)}
			</ul>)}
			/>
			<Message
			header='Upload completed'
			
			hidden={!completed}
			color={success===images.length?'green':'yellow'}
			content={(<ul>
				<li>Successful uploads: {success}</li>
				<li>Failed uploads: {images.length-success}</li>
			</ul>)}
			/>
			
		  {completed?'':<Button type='submit' id="uploadBtn">Modify album</Button>}
		  {completed?<Button as={Link} to={`/gallery/album/${album_id}`} color="teal">View Album</Button>:''}
		  
        </Form>
      </Container>
    </ResponsiveContainer>
  )
}
}