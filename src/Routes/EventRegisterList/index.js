import React, {Component} from 'react'
import {
Header,
Container,
Table,
Button
} from 'semantic-ui-react'
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import {Link} from 'react-router-dom'
import firebase from 'firebase/app';





/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class EventRegisterList extends Component{
  state={
    students:[]
  }
  constructor(props){
    super(props);
    this.init=this.init.bind(this);
  }
  componentDidMount(){
    this.init();
    
  }
  async init(){
    let ref = await firebase.firestore().collection("register").get();
    this.setState({students:ref.docs});
  }
 
  render=()=>{
    
  return (
    <ResponsiveContainer>
      <Container text textAlign="center" style={{ marginTop: '7em' ,minHeight:700}}>
      <Header as='h1'>List of students registered</Header>
      <Button as={Link} to="/"  secondary>Go Home</Button>
      
      <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Register Number</Table.HeaderCell>
        <Table.HeaderCell>Class</Table.HeaderCell>
        <Table.HeaderCell>Contact</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {this.state.students.map(student=>
        <Table.Row>
          <Table.Cell>{student.data().name}</Table.Cell>
          <Table.Cell>{student.data().register}</Table.Cell>
          <Table.Cell>{student.data().className}</Table.Cell>
          <Table.Cell>{student.data().contact}</Table.Cell>
        </Table.Row>)
      }
     
      
    </Table.Body>
    </Table>
      </Container>
    </ResponsiveContainer>
  )
    }
}