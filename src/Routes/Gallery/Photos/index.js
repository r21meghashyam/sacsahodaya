import React, {Component} from 'react'
import {
  Button,
  Icon,
  Confirm
  } from 'semantic-ui-react'
import bindAll from 'react-autobind';

//Components
import firebase from 'firebase/app';
import Lightbox from 'react-images'
import Gallery from 'react-photo-gallery';
import Redux from '../../../Lib/Redux';


/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */


export default class Photos extends Component{ 
  state={
    images:[],
    lightboxIsOpen:false,
    currentImage:0
  }
  constructor(props){
    super(props);
    bindAll(this);
    
    let imagesRef = firebase.firestore().collection('images');
    if(this.props.limit)
      imagesRef = imagesRef.limit(this.props.limit)
    imagesRef.onSnapshot(snapshot=>{
      let images=[];
      snapshot.docs.forEach(doc=>{
          let data = doc.data();
          images.push({
            src:data.url,
            width:data.width,
            height:data.height,
            album:data.album,
            id:doc.id
          })
          this.setState({images});
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
  closeConfirm(){
    this.setState({showConfirm:false})
  }
  onDeletePhotoButtonClick(){
    this.setState({
      onConfirmFunction: this.deletePhoto,
      showConfirm:true,
      lightboxIsOpen:false
    })
  }
  onConfirmTrue(){
    this.state.onConfirmFunction.call();
  }
  viewImage(e,obj){
    this.setState({currentImage:obj.index,lightboxIsOpen:true});
  }
  async deletePhoto(){
    console.log(this,this.state,this.state.currentImage);
    this.setState({showConfirm:false})
    let image = this.state.images[this.state.currentImage];
    if(image.album){
      //TODO delete from album list
    }
    let file = image.id+"."+image.type;
    await firebase.firestore().collection("images").doc(image.id).delete();
    await firebase.storage().ref().child('images').child(file).delete();
    //let image = imageIds[this.state.currentImage] +'.' + this.state.images[this.state.currentImage].type;
    //imageIds.splice(this.state.currentImage,1);
    //firebase.firestore().collection("albums").doc(album).set({imageIds},{merge:true})
    //firebase.storage().ref().child('images').child(image).delete();
  }
  render(){
    //console.log(this,this.state.images)
    return(
      <React.Fragment>
      <Gallery photos={this.state.images} onClick={this.viewImage}/>
      <Lightbox
        images={this.state.images}
        currentImage={this.state.currentImage}
        isOpen={this.state.lightboxIsOpen}
        onClickPrev={this.gotoPrevLightboxImage}
        onClickNext={this.gotoNextLightboxImage}
        onClose={this.closeLightbox}
        showThumbnails={true}
        onClickThumbnail={this.onClickThumbnail}
        customControls={this.state.userWritable?[
          <span key={0}>
            <Button onClick={this.onDeletePhotoButtonClick} floated='right' color="red" icon><Icon name="trash" /> Delete photo</Button>
          </span>
        ]:[]}
      />
      <Confirm style={{zIndex:3000}} open={this.state.showConfirm} onCancel={this.closeConfirm} onConfirm={this.onConfirmTrue} />

      </React.Fragment>
  )}
}