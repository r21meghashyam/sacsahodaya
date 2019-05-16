import React, {Component} from 'react'
import {
Header,
Container,
Segment,
Button,
Icon,
Confirm
} from 'semantic-ui-react'
import autoBind from 'react-autobind';
import {Link} from 'react-router-dom'

//Components
import ResponsiveContainer from '../../../Components/ResponsiveContainer'
import firebase from 'firebase/app';
import Lightbox from 'react-images'
import Gallery from 'react-photo-gallery';
import Redux from '../../../Lib/Redux';
import moment from 'moment';

export default class ViewAlbum extends Component{ 
  state={
    images:[],
    lightboxIsOpen:false,
    currentImage:0
  }
  constructor(props){
    super(props);
    autoBind(this);
    
    let album_id = this.props.match.params.album_id;
    firebase.firestore().collection('albums').doc(album_id).onSnapshot(doc=>{
      let data = doc.data();
      let images=[];
      this.setState(data);
      if(!data.imageIds)
        return;
      if(data.imageIds.length===0)
        this.setState({image:[],imageIds:[]});
      data.imageIds.forEach(image=>{
        firebase.firestore().collection('images').doc(image).onSnapshot(doc=>{
          let data = doc.data();
          images.push({src:data.url,width:data.width,height:data.height,type:data.type,id:doc.id})
          this.setState({images});
        })
      })
      
    })
  }
  componentDidMount(){
    console.log(this);
    this.checkState();
    Redux.subscribe(()=>{
      this.checkState();
    })
  }
  checkState(){
    let state = Redux.getState();
    if(state.user)
      this.setState({
        userWritable:state.user.role==="Editor"||state.user.role==="Admin"
      })
  }
  closeLightbox(){
    this.setState({lightboxIsOpen:false})
  }
  openLightbox(){
    this.setState({lightboxIsOpen:true})
  }
  gotoNextLightboxImage(){
    let {currentImage,images} = this.state
    this.setState({currentImage:(currentImage+1)%images.length})
  }
  gotoPrevLightboxImage(){
    let {currentImage,images} = this.state
    this.setState({currentImage:(currentImage-1)%images.length})
  }
  onClickThumbnail(e){
    this.setState({currentImage:e});
  }
  viewImage(e,obj){
    this.setState({currentImage:obj.index,lightboxIsOpen:true});
  }
  onDeleteAlbumButtonClick(){
    this.setState({
      onConfirmFunction: this.deleteAlbum,
      showConfirm:true,
      
    })
  }
  onDeletePhotoButtonClick(){
    this.setState({
      onConfirmFunction: this.deletePhoto,
      showConfirm:true,
      lightboxIsOpen:false
    })
  }
  closeConfirm(){
    this.setState({showConfirm:false})
  }
  deleteAlbum(){
    this.setState({showConfirm:false})
    let album_id = this.props.match.params.album_id;

    
      firebase.firestore().collection('albums').doc(album_id).delete().then(()=>{
        let count = this.state.images.length;
        if(this.state.images.length===0)
          this.props.history.push('/gallery')
        this.state.images.forEach(image=>{
          firebase.firestore().collection('images').doc(image.id).delete().then(()=>{
            firebase.storage().ref().child('images').child(image.id+'.'+image.type).delete().then(()=>{
              count--;
              if(count===0)
              this.props.history.push('/gallery')
            })
            
          })
        })
    })
    
  }
  onConfirmTrue(){
    this.state.onConfirmFunction.call();
  }
  async deletePhoto(){
    console.log(this,this.state,this.state.currentImage);
    this.setState({showConfirm:false})
    let album = this.props.match.params.album_id;
    let imageIds = this.state.imageIds;
    let image = imageIds[this.state.currentImage] +'.' + this.state.images[this.state.currentImage].type;
    imageIds.splice(this.state.currentImage,1);
    firebase.firestore().collection("albums").doc(album).set({imageIds},{merge:true})
    firebase.storage().ref().child('images').child(image).delete();
  }
  render(){
    let {name,userWritable} = this.state;
    //console.log(this,this.state.images)
    return(
    <ResponsiveContainer>
      <Container fluid style={{padding:20,minHeight:700}}>
      <Segment clearing basic>
        <Header as='h1' floated="left">{name}</Header>
        {userWritable?
        <>
        <Button onClick={this.onDeleteAlbumButtonClick} floated='right' color="red" icon><Icon name="trash" /> Delete Album</Button>
        <Link to={`/gallery/album/${this.props.match.params.album_id}/add`}><Button floated='right' color="green" icon><Icon name="add" /> Modify Album</Button></Link>
        </>
        :''}
      </Segment>
      <Segment style={{padding:20,fontSize:'1.5em'}} basic>
        {this.state.description}
      </Segment>
      <Segment basic>
        <Icon name="calendar alternate"/>{moment(this.state.date).format('MMMM Do YYYY')}
      </Segment>
      <Gallery photos={this.state.images} onClick={this.viewImage}/>
      <Lightbox
        images={this.state.images}
        currentImage={this.state.currentImage}
        isOpen={this.state.lightboxIsOpen}
        onClickPrev={this.gotoPrevLightboxImage}
        onClickNext={this.gotoNextLightboxImage}
        onClose={this.closeLightbox}
        showThumbnails={true}
        customControls={userWritable?[
          <span key={0}>
            <Button onClick={this.onDeletePhotoButtonClick} floated='right' color="red" icon><Icon name="trash" /> Delete photo</Button>
          </span>
        ]:[]}
        onClickThumbnail={this.onClickThumbnail}
      />
      <Confirm style={{zIndex:3000}} open={this.state.showConfirm} onCancel={this.closeConfirm} onConfirm={this.onConfirmTrue} />
      </Container>
    </ResponsiveContainer>
  )}
}