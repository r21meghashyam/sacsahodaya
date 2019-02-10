import React, {Component} from 'react'
import {
Header,
Container,
Icon,
Segment,
Modal,
Button
} from 'semantic-ui-react'
import firebase from 'firebase/app';
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class Login extends Component{ 
  state={
    modalOpen:false,
    loggingIn:false,
    
  }
  close(){
    this.setState({modalOpen:false})
  }
  registerWithGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider();
    this.setState({loggingIn:true,loggingInText:'Trying to log in using Google, please check the sign in tab'},()=>{
      firebase.auth().signInWithPopup(provider).then((result)=> {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // The signed-in user info.
        var user = result.user;
        let firestore = firebase.firestore();
        let name = user.displayName.split(" ");
        let firstName = name.shift();
        let lastName = name.join(" ");
        
        firestore.collection("users").doc(user.uid).set({
          firstName,
          lastName,
          provider:user.toJSON().providerData,
          email:user.email,
          lastLoginAt: user.toJSON().lastLoginAt,
          createdAt:user.toJSON().createdAt,
          photoURL:user.photoURL
        },{merge:true}).then(success=>{
          
              this.props.history.push('/');
          
        },error=>{
          this.setState({
            modalOpen:true,
            modelHeader:'Error: '+error.code,
            modelContent: error.message,
            loggingIn:false
          })
        })
        
        
        // ...
      }).catch((error)=>{
        // Handle Errors here.
        this.setState({
          modalOpen:true,
          modelHeader:'Error: '+error.code,
          modelContent: error.message,
          loggingIn:false
        })
        // The email of the user's account used.
        //var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        //var credential = error.credential;
        // ...
      });
    })
    
  }
  constructor(props){
    super(props);
    this.registerWithGoogle=this.registerWithGoogle.bind(this);
    this.close=this.close.bind(this);
    firebase.auth().onAuthStateChanged((state)=>{
      if(state)
        this.props.history.push('/');
      else
        this.setState({render:true})
    })

  }
  render(){
    let {modalOpen,modelHeader,modelContent,loggingIn,loggingInText,render} = this.state;
    return render?(
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' }} >
      
        <Segment inverted style={{margin:10}}>
          <Header as='h1'>Login</Header>
          <Header as='h3'>Choose one of the methods to login to your account</Header>
          <Segment textAlign="center" inverted>
            <Icon name="mail" circular size="big" color='teal' disabled style={{margin:20,cursor:''}} inverted/>
            <Icon name="google" onClick={this.registerWithGoogle} circular size="big" color='teal' inverted style={{margin:20,cursor:'pointer'}}/>
            <Icon name="facebook" circular  size="big" color='teal' disabled inverted style={{margin:20,cursor:''}}/>
            <Icon name="twitter" circular  size="big" color='teal' disabled inverted style={{margin:20,cursor:''}}/>
          </Segment>
         {loggingIn?<React.Fragment><Icon loading name="spinner"></Icon>{loggingInText}</React.Fragment>:''}
        </Segment>

      
   
      </Container>
      <Modal size='mini' open={modalOpen} onClose={this.close}>
          <Modal.Header>{modelHeader}</Modal.Header>
          <Modal.Content>
            <p>{modelContent}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.close}>Close</Button>
          </Modal.Actions>
        </Modal>
    </ResponsiveContainer>
  ):'';
  }
}