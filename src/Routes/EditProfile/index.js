import React, {Component} from 'react'
import {
Header,
Container,
Icon,
Table,
Button
} from 'semantic-ui-react'
import firebase from 'firebase/app';
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import { Form, Formik } from 'formik';

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class EditProfile extends Component{ 
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
      console.log(data);
      this.setState(data);
    })
  }
  
  render(){
    let {firstName,lastName,photoURL,createdAt,email} = this.state;
    return(
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' }} >
       
          <Header as='h1'>Edit Profile </Header>
          <Formik>
            <Form>
            <Table definition>
              

              <Table.Body>
              <Table.Row>
                  <Table.Cell>
                    Name
                  </Table.Cell>
                  <Table.Cell>{email}</Table.Cell>
                </Table.Row>
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
                  <Table.Cell>No phone number has been registered</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Current Occupation
                  </Table.Cell>
                  <Table.Cell>No details</Table.Cell>
                </Table.Row>
              </Table.Body>
              
            </Table>
          </Form>
        </Formik>
          
          <Button icon color="teal" style={{marginTop:10}}><Icon name="save"/>Save changes</Button>

      
   
      </Container>
      
    </ResponsiveContainer>
  )
  }
}