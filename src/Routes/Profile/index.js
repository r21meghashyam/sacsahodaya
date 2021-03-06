import React, {Component} from 'react'
import {
Header,
Container,
Icon,
Table,
Image,
Button
} from 'semantic-ui-react'
import firebase from 'firebase/app';
import {Link} from 'react-router-dom';
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class Profile extends Component{ 
  state={
    modalOpen:false,
    loggingIn:false,
    email:' ',
    createdAt: 0
  }
  close(){
    this.setState({modalOpen:false})
  }
  constructor(props){
    super(props);
    this.close=this.close.bind(this);
    if(!firebase.auth().currentUser){
      this.props.history.push('/');
      return;
    }
    let firestore = firebase.firestore(); 
    let uid = firebase.auth().currentUser.uid;
    firestore.doc(`users/${uid}`).onSnapshot(doc=>{
      const data = doc.data();
      //console.log(data);
      this.setState(data);
    })
  }
  
  render(){
    let {firstName,lastName,photoURL,createdAt,email,phoneNumber,occupation} = this.state;
    return(
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' }} >
       
          <Header as='h1'><Image src={photoURL} circular/> {firstName} {lastName} </Header>
          <Table definition>
            

            <Table.Body>
            <Table.Row>
                <Table.Cell>
                 Primary Email ID
                </Table.Cell>
                <Table.Cell>{email}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                 Date Joined
                </Table.Cell>
                <Table.Cell>{(new Date(Number(createdAt))).getFullYear()}</Table.Cell>
              </Table.Row>
            
            <Table.Row>
                <Table.Cell>
                 Linked Accounts
                </Table.Cell>
                <Table.Cell><Icon name="google" circular/></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Phone Number
                </Table.Cell>
                <Table.Cell>{phoneNumber}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Current Occupation
                </Table.Cell>
                <Table.Cell>{occupation}</Table.Cell>
              </Table.Row>
            </Table.Body>
             
          </Table>

          <Button as={Link} to="/edit-profile"  icon><Icon name="edit"/>Edit profile</Button>

      
   
      </Container>
      
    </ResponsiveContainer>
  )
  }
}