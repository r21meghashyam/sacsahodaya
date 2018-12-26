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
export default class LogOut extends Component{ 
  state={
    modalOpen:false
  }
  close(){
    this.setState({modalOpen:false})
  }
  
  constructor(props){
    super(props);
    this.close=this.close.bind(this);
    firebase.auth().onAuthStateChanged((state)=>{
      if(!state)
        this.props.history.push('/');
    })
  
  }
  componentDidMount(){
    firebase.auth().signOut().then(success=>{},error=>{
      this.setState({
        modelHeader:'Error '+error.code,
        modelContent:error.message,
        modalOpen:true
      })
    })
  }
  render(){
    let {modalOpen,modelHeader,modelContent} = this.state;
    return(
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' }} >
      
        <Segment inverted>
         
          <Header as='h3'>
          
          <Icon loading name="spinner"/>Please wait while we are logging you out
          </Header>
          
         
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
  )
  }
}