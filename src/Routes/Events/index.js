import React, {Component} from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import {
  Button,Icon
} from 'semantic-ui-react'
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import firebase from 'firebase/app';
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import {Link} from 'react-router-dom';
import Redux from '../../Lib/Redux';

const localizer = BigCalendar.momentLocalizer(moment) 



export default class Events extends Component{
  state={
    events:[]
  }
  componentWillMount(){
    firebase.firestore().collection('events').onSnapshot(snapshot=>{
      let events=[];
      snapshot.docs.forEach(doc=>{
        events.push(doc.data());
      });
      this.setState({events});
    });
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
  render=()=>{
    return(<ResponsiveContainer>
            {this.state.userWritable?<Button as={Link} to="/events/add-event" style={{margin:30}} color="twitter" icon><Icon name="add" /> Add Event</Button>:''}
      <div style={{ height: 700 }}>
      <BigCalendar
        localizer={localizer}
        events={this.state.events}
        startAccessor="start"
        endAccessor="end"
      /></div>
    </ResponsiveContainer>)
    }
}