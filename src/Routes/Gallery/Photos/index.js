import React, {Component} from 'react'


//Components
import firebase from 'firebase/app';
import Lightbox from 'react-images'
import Gallery from 'react-photo-gallery';

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
    this.closeLightbox=this.closeLightbox.bind(this)
    this.openLightbox=this.openLightbox.bind(this)
    this.gotoNextLightboxImage=this.gotoNextLightboxImage.bind(this)
    this.gotoPrevLightboxImage=this.gotoPrevLightboxImage.bind(this)
    this.onClickThumbnail=this.onClickThumbnail.bind(this)
    this.viewImage=this.viewImage.bind(this)
    this.closeConfirm=this.closeConfirm.bind(this)
    this.askConformation=this.askConformation.bind(this)
    this.deleteAlbum=this.deleteAlbum.bind(this)
    
    let imagesRef = firebase.firestore().collection('images');
    if(this.props.limit)
      imagesRef = imagesRef.limit(this.props.limit)
    imagesRef.onSnapshot(snapshot=>{
      let images=[];
      snapshot.docs.forEach(doc=>{
          let data = doc.data();
          images.push({src:data.url,width:data.width,height:data.height})
          this.setState({images});
      })
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
  askConformation(){
    this.setState({showConfrim:true})
  }
  closeConfirm(){
    this.setState({showConfrim:false})
  }
  deleteAlbum(){
    this.setState({showConfrim:false})
    let album_id = this.props.match.params.album_id;
    firebase.firestore().collection('albums').doc(album_id).delete().then(()=>{
      this.props.history.push('/gallery')

    })
    
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
      />
      </React.Fragment>
  )}
}