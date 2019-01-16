import React, {Component} from 'react'
import {
Header,
Container,
Icon,
Table,
Button,
Form
} from 'semantic-ui-react'
import firebase from 'firebase/app';
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class EditProfile extends Component{ 
  state={
    modalOpen:false,
    loggingIn:false,
    data:{}
  }
  close(){
    this.setState({modalOpen:false})
  }
  onChange(e){
    let data = this.state.data;
    data[e.target.name] = e.target.value
    this.setState({data});
    let saveBtn = document.querySelector("#saveBtn");
    //console.log(saveBtn)
    saveBtn.innerHTML="Save changes"
  }
  onSubmit(e){
    e.preventDefault();
    let saveBtn = document.querySelector("#saveBtn");
    //console.log(saveBtn)
    saveBtn.innerHTML="Saving changes..."
    //console.log(this.state)
    let firestore = firebase.firestore(); 
    let uid = firebase.auth().currentUser.uid;
    firestore.doc(`users/${uid}`).set(this.state.data,{merge:true}).then(()=>{
      saveBtn.innerHTML="Saved"
    });
  }
  constructor(props){
    super(props);
    this.close=this.close.bind(this);
    this.onChange=this.onChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
    if(!firebase.auth().currentUser){
      this.props.history.push('/');
      return;
    }
    let firestore = firebase.firestore(); 
    let uid = firebase.auth().currentUser.uid;
    firestore.doc(`users/${uid}`).onSnapshot(doc=>{
      const data = doc.data();
      this.setState({data});
    })
  }
  
  render(){
    let {firstName,lastName,phoneNumber,occupation} = this.state.data;
    return(
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' }} >
       
          <Header as='h1'>Edit Profile </Header>
          
            <Form onSubmit={this.onSubmit}>
            <Table definition>
              

              <Table.Body>
              <Table.Row>
                  <Table.Cell>
                    Name
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Group widths='equal'>
                      <Form.Input fluid label='First name' name="firstName" onChange={this.onChange} placeholder='First name' value={firstName}/>
                      <Form.Input fluid label='Last name'  name="lastName" onChange={this.onChange} placeholder='First name' value={lastName}/>
                    </Form.Group>
                  </Table.Cell>
                </Table.Row>
              
                <Table.Row>
                  <Table.Cell>
                    Phone Number
                  </Table.Cell>
                  <Table.Cell><Form.Input fluid placeholder='Phone Number' name="phoneNumber" onChange={this.onChange} value={phoneNumber} type="number"/></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Current Occupation
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Input fluid placeholder='Enter Occupation' name="occupation" onChange={this.onChange} value={occupation}/>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
              
            </Table>
            <Button icon color="teal" style={{marginTop:10}}><Icon name="save"/><span id="saveBtn" >Save changes</span></Button>
            <Button icon color="red" onClick={()=>{this.props.history.push("/profile")}} style={{marginTop:10}}><Icon name="cancel"/>Cancel</Button>

          </Form>
          

      
   
      </Container>
      
    </ResponsiveContainer>
  )
  }
}