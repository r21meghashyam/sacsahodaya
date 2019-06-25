import React, {Component} from 'react'
import {
Header,
Container,
Message,
Button,
Label,
Form,
Loader
} from 'semantic-ui-react'
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import firebase from 'firebase/app';
import {Link} from 'react-router-dom'
import Redux from '../../Lib/Redux';


/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class EventRegister extends Component{
  state={
    error:""
  }

  constructor(props){
    super(props);
    this.handleChange=this.handleChange.bind(this);
    this.save = this.save.bind(this);
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
  handleChange(event){
    this.setState({[event.target.name]:event.target.value});
  }

  async save(){
    try{
      this.setState({error:""});
      if(!this.state.name||!this.state.name.length===0)
        throw Error("Please enter name");
        if(!this.state.register||!this.state.register.length===0)
        throw Error("Please enter register number");
      if(!this.state.className||!this.state.className.length===0)
        throw Error("Please enter class name");
      if(!this.state.contact||!this.state.contact.length===0)
        throw Error("Please enter contact number");
      let {name,register,className,contact} = this.state;
      console.log({
        name,
        register, 
        className,
        contact,
        time: Date.now()
      })
      this.setState({
        saving:true
      });
      await firebase.firestore().collection("register").add({
        name,
        register,
        className,
        contact,
        time: Date.now()
      })
      this.props.history.push('/event-register-success');
      
    }
    catch(err){
      this.setState({error:err.message});
    }
      
  }
  
  render=()=>{
    
  return (
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' ,minHeight:700}}>
      <Header as='h1'>Event Registration 
      
      {this.state.userWritable?
        <Button as={Link} to="/event-register-list">View registered list</Button>:<></>}</Header>
      <Message error header={this.state.error} hidden={this.state.error.length===0}/>
      <Form>
      
      <Form.Field>
          <Label pointing='below'>Your Name</Label>
          <input type='text' name="name" onChange={this.handleChange} placeholder='Name' />
        </Form.Field>
        <Form.Field>
          <Label pointing='below'>Your Register Number</Label>
          <input type='number' name="register" onChange={this.handleChange} placeholder='Register Number' />
        </Form.Field>
        <Form.Field>
          <Label pointing='below'>Your Class</Label>
          <input type='text' name="className" onChange={this.handleChange} placeholder='Class' />
        </Form.Field>
        <Form.Field>
          <Label pointing='below'>Your Contact Number</Label>
          <input type='number' name="contact" onChange={this.handleChange} placeholder='Contact Number' />
        </Form.Field>
  <Button primary onClick={this.save}>{this.state.saving?<Loader active inline />:<>Count me in</>}</Button>
      </Form>
      </Container>
    </ResponsiveContainer>
  )
    }
}