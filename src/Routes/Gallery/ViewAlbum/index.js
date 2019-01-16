import React, {Component} from 'react'
import {
Header,
Container,
Segment,
Button,
Icon,
Confirm
} from 'semantic-ui-react'

//Components
import ResponsiveContainer from '../../../Components/ResponsiveContainer'
import firebase from 'firebase/app';
import Lightbox from 'react-images'
import Gallery from 'react-photo-gallery';
import Redux from '../../../Lib/Redux';
import moment from 'moment';

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */


export default class ViewAlbum extends Component{ 
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
    
    let album_id = this.props.match.params.album_id;
    firebase.firestore().collection('albums').doc(album_id).get().then(doc=>{
      let data = doc.data();
      let images=[];
      this.setState(data);
      data.imageIds.forEach(image=>{
        firebase.firestore().collection('images').doc(image).get().then(doc=>{
          let data = doc.data();
          images.push({src:data.url,width:data.width,height:data.height,type:data.type,id:doc.id})
          this.setState({images});
        })
      })
      
    })
  }
  componentDidMount(){
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
        let count = this.state.images.length;
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
  render(){
    let {name,userWritable} = this.state;
    //console.log(this,this.state.images)
    return(
    <ResponsiveContainer>
      <Container fluid style={{padding:20,minHeight:700}}>
      <Segment clearing basic>
        <Header as='h1' floated="left">{name}</Header>
        {userWritable?<Button onClick={this.askConformation} floated='right' color="red" icon><Icon name="trash" /> Delete Album</Button>:''}
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
        onClickThumbnail={this.onClickThumbnail}
      />
      <Confirm open={this.state.showConfrim} onCancel={this.closeConfirm} onConfirm={this.deleteAlbum} />
      </Container>
    </ResponsiveContainer>
  )}
}