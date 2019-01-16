import React, {Component} from 'react'
import {
Header,
Container,
Image,
Table,
Select,
Modal,
Button
} from 'semantic-ui-react'
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import firebase from 'firebase/app';

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class Gallery extends Component{
  state={
    users:[]
  }
  onChange(e){
    //console.log(e);
    let uid = e.name;
    let role = e.value;
    if(role)
    firebase.firestore().doc(`users/${uid}`).set({role},{merge:true}).then((d)=>{
      //console.log(d);
      this.setState({
        modelContent:"Role changed to "+role,
        modelHeader:"Update Successful",
        modalOpen:true
      })
    })
  }
  close(){
    this.setState({modalOpen:false})
  }
  constructor(props){
    super(props);
    this.onChange=this.onChange.bind(this);
    this.close=this.close.bind(this);
    let firestore = firebase.firestore();
    firebase.auth().onAuthStateChanged((user)=>{
      if(user)
      firestore.doc(`users/${user.uid}`).get().then(d=>{
        this.setState({userRole:d.data().role})
      });
    })
   
    firestore.collection("users").onSnapshot(snapshot=>{
      let users = [];
      snapshot.docs.forEach(doc=>{
        let data = doc.data();
        data.uid=doc.id;
        users.push(data);
      })
      this.setState({users});
    })
  } 
  render=()=>{
    let {modalOpen,modelHeader,modelContent} = this.state;
  return (
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' ,minHeight:700}}>
      <Header as='h1'>Members</Header>
      <Table basic='very' celled collapsing>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Member</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
        <Table.HeaderCell>Joined</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {
        this.state.users.map((user,index)=>(
      <Table.Row key={index}>
        <Table.Cell>
          <Header as='h4' image>
            <Image src={user.photoURL} rounded size='mini' />
            <Header.Content>
              {user.firstName} {user.lastName}
              
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{this.state.userRole==='Admin'?<Select placeholder="Select Role" name={user.uid} onChange={(e,d)=>this.onChange(d)} value={user.role||'Subscriber'} options={[{text:'Admin',value:'Admin',key:1},{text:'Editor',value:'Editor',key:2},{text:'Subscriber',value:'Subscriber',key:3}]}/>:user.role||'Subscriber'}</Table.Cell>
        <Table.Cell>{(new Date(Number(user.createdAt))).getFullYear()}</Table.Cell>
      </Table.Row>
        ))
      }
      
      
    </Table.Body>
  </Table>
   
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