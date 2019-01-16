import React, {Component} from 'react'
import {
  Icon,
  Card,
  
  Message, 
  Placeholder
} from 'semantic-ui-react'
import firebase from 'firebase/app';
import {Link} from 'react-router-dom'
import moment from 'moment';

export default class Albums extends Component{ 
  state={
    albums:[],
    loaded:false
  } 
  albumSnapshotListener=null
  constructor(props){ 
    super(props);
    this.albumSnapshotListener = firebase.firestore().collection("albums").onSnapshot(snapshot=>{
      let albums=[];
      //console.log(snapshot)
      let count = snapshot.size;
      if(count===0)
        this.setState({loaded:true})
      
      snapshot.docs.forEach(doc=>{
        let album = doc.data();
        album.id = doc.id;
        
        firebase.firestore().collection('images').doc(album.imageIds[0]).get().then(doc=>{
          album.thumbnail= doc.data().url;
          let index = albums.push(album)-1;
          let img = new window.Image();
          img.onload=()=>{
            albums[index].thumbnailLoaded=true;
            this.setState({albums})
          }
          img.src=album.thumbnail;
          count--;
          this.setState({albums})
         if(count===0)
          this.setState({loaded:true})
        })
        
      })
      
    })
    
  }
  date(timestamp){
    timestamp = timestamp - ((new Date()).getTimezoneOffset()*60*1000)
    return moment(timestamp).format('D-M-YYYY')
  }
  componentWillUnmount(){
    this.albumSnapshotListener();
  }
  render(){

    //console.log(this.state)
   return(
   <div style={{marginTop:10,marginBottom:100}}>
   <Card.Group style={{textAlign:'center'}}>
   {
      this.state.loaded?(
        this.state.albums.length===0?(
          <Message icon>
        
          <Message.Content>
            <Message.Header>No Albums</Message.Header>
            There are no pictures
          </Message.Content>
        </Message>
        ):(
          this.state.albums.map((album,index)=>(
            <Card key={index} as={Link} to={`/gallery/album/${album.id}`} >
              
              {album.thumbnailLoaded?
              (<Placeholder>
                <Placeholder.Image  style={
                  {
                    backgroundImage:`url(${album.thumbnail})`,
                    backgroundPosition:'center',
                    backgroundSize:'cover'
                  }
                } square />
              </Placeholder>):
                (<Placeholder>
                  <Placeholder.Image  square />
                </Placeholder>)}
             
               
             
              <Card.Content extra>
              <Card.Header>{album.name}</Card.Header>
                <Card.Meta>
                  <span className='date'>{this.date(album.date)}</span>
                </Card.Meta>
                <Card.Description>{album.description}</Card.Description>
                  <Icon name='image' />
                  {album.imageIds.length}
                
              </Card.Content>
            </Card>
           ))
        )
      ):(
        <Message icon>
      <Icon name='spinner' loading />
      <Message.Content>
        <Message.Header>Just one second</Message.Header>
        We are fetching that content for you.
      </Message.Content>
    </Message>
      )
   }
  
   </Card.Group>
     
   </div>
  )}
}