import React, {Component} from 'react'
import {
Header,
Container,
Icon,
Table,
Button,
Form,
Segment,
Message
} from 'semantic-ui-react'
import firebase from 'firebase/app';
//Components
import ResponsiveContainer from '../../../Components/ResponsiveContainer'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import  {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import moment from 'moment';


/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class AddEvent extends Component{ 
  state={
    modalOpen:false,
    loggingIn:false,
    data:{},
    startTime:'00:00',
    startDate:new Date(),
    endDate:new Date(),
    endTime:'00:00',
    error:{}
  }
  close(){
    this.setState({modalOpen:false})
  }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
    let saveBtn = document.querySelector("#saveBtn");
    saveBtn.innerHTML="Add Event"
  }
  toTimeStamp(time){
    if(time==="")
      return '00:00';
    let array = time.split(':')
    let hours = Number(array[0]);
    let minutes = Number(array[1]);
    let timestamp = (hours*60+minutes)*60*1000;
    return timestamp;
  }
  handleDate(type,date,time){
    console.log(type,date,time);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    this.setState({
      [type+'Date']:date,
      [type+'Time']:time,
      [type]:date.getTime()+this.toTimeStamp(time)
    },()=>{
      console.log(this.state);
      console.log(new Date(this.state[type]));
    });
    
  }
  
  onSubmit(e){
    e.preventDefault();
    this.setState({error:{}});
    if(!this.state.title||this.state.title===""){
      let error={
        title:"Missing title",
        message:"You forgot to enter title"
      }
      this.setState({error});
      return;
    }
    if(!this.state.start){
      let error={
        title:"Start Date Missing",
        message:"You forgot to enter starting date"
      }
      this.setState({error});
      return;
    }
    if(!this.state.end){
      let error={
        title:"End Date Missing",
        message:"You forgot to enter ending date"
      }
      this.setState({error});
      return;
    }

    if(this.state.end<this.state.start){
      let error={
        title:"Error with dates",
        message:"Event cannot end before it starts!"
      }
      this.setState({error});
      return;
    }
    
    let saveBtn = document.querySelector("#saveBtn");
    saveBtn.innerHTML="Adding Event.."
    saveBtn.disabled=true;
    let firestore = firebase.firestore(); 
    let uid = firebase.auth().currentUser.uid;
    firestore.collection(`events`).add({
      title:this.state.title,
      start:this.state.start,
      end:this.state.end,
      postedBy:uid
    }).then(()=>{
      saveBtn.innerHTML="Event Added";
    });
  }
  constructor(props){
    super(props);
    this.close=this.close.bind(this);
    this.onChange=this.onChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
    this.handleDate=this.handleDate.bind(this);
  }
  
  render(){
    
    return(
    <ResponsiveContainer>
      <Container text style={{ margin: '7em 0px 10em', }} >
       
          <Header as='h1'>Add Event </Header>
          
            <Form onSubmit={this.onSubmit} error={Boolean(this.state.error)}>
            <Table definition>
              <Table.Body>
              <Table.Row>
                  <Table.Cell>
                    Title
                  </Table.Cell>
                  <Table.Cell>
                      <Form.Input name="title" onChange={this.onChange} placeholder='Title' />
                  </Table.Cell>
                </Table.Row>
              
                <Table.Row>
                  <Table.Cell>
                    Start Date
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                  <DayPickerInput formatDate={formatDate}  parseDate={parseDate} value={`${moment(this.state.date).format('D/M/YYYY')}`} placeholder={`${formatDate(new Date())}`} onDayChange={(e)=>{this.handleDate('start',e,this.state.startTime)}}/>
                  <Form.Input  type="time" onChange={(e)=>{this.handleDate('start',this.state.startDate,e.target.value)}}  />
                  </Form.Group>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    End Date
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                      <DayPickerInput formatDate={formatDate} onChange={this.onChange} parseDate={parseDate} value={`${moment(this.state.date).format('D/M/YYYY')}`} placeholder={`${formatDate(new Date())}`} onDayChange={(e)=>{this.handleDate('end',e,this.state.endTime)}}/>
                      <Form.Input type="time" onChange={(e)=>{this.handleDate('end',this.state.endDate,e.target.value)}}  />
                    </Form.Group>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
              
            </Table>
          <Message
              error
              header={this.state.error.title}
              content={this.state.error.message}
            />
            <Segment basic>
            <Button icon color="teal" style={{marginTop:10}}><Icon name="add"/><span id="saveBtn" >Add Event</span></Button>
            <Button icon color="red" onClick={()=>{this.props.history.push("/events")}} style={{marginTop:10}}><Icon name="cancel"/>Cancel</Button>
            </Segment>
          </Form>
          

      
   
      </Container>
      
    </ResponsiveContainer>
  )
  }
}